package internal

import (
  "io"
  "log"
  "net"
  "time"

  "go.uber.org/zap"
)

type Forwarder struct {
  logger *zap.Logger
  config ConfigResponse
}

func NewForwarder(logger *zap.Logger, config ConfigResponse) *Forwarder {
  return &Forwarder{
    logger: logger,
    config: config,
  }
}

func (f *Forwarder) StartTCPProxy(listenAddr, targetAddr string) error {
  listener, err := net.Listen("tcp", listenAddr)
  if err != nil {
    return err
  }
  defer listener.Close()

  f.logger.Info("TCP proxy listening", zap.String("addr", listenAddr), zap.String("target", targetAddr))

  for {
    conn, err := listener.Accept()
    if err != nil {
      f.logger.Error("Accept error", zap.Error(err))
      continue
    }

    go f.handleConnection(conn, "tcp", targetAddr)
  }
}

func (f *Forwarder) handleConnection(clientConn net.Conn, protocol, targetAddr string) {
  defer clientConn.Close()

  targetConn, err := net.Dial(protocol, targetAddr)
  if err != nil {
    f.logger.Error("Dial target error", zap.Error(err))
    return
  }
  defer targetConn.Close()

  // Copy data in both directions
  go func() {
    _, err := io.Copy(targetConn, clientConn)
    if err != nil {
      f.logger.Error("Copy client to target error", zap.Error(err))
    }
  }()

  _, err = io.Copy(clientConn, targetConn)
  if err != nil {
    f.logger.Error("Copy target to client error", zap.Error(err))
  }
}

func (f *Forwarder) StartUDPProxy(listenAddr, targetAddr string) error {
  pc, err := net.ListenPacket("udp", listenAddr)
  if err != nil {
    return err
  }
  defer pc.Close()

  f.logger.Info("UDP proxy listening", zap.String("addr", listenAddr), zap.String("target", targetAddr))

  buffer := make([]byte, 65535)

  for {
    n, clientAddr, err := pc.ReadFrom(buffer)
    if err != nil {
      f.logger.Error("Read from client error", zap.Error(err))
      continue
    }

    data := buffer[:n]

    targetConn, err := net.Dial("udp", targetAddr)
    if err != nil {
      f.logger.Error("Dial target UDP error", zap.Error(err))
      continue
    }
    targetConn.SetWriteDeadline(time.Now().Add(5 * time.Second))

    _, err = targetConn.Write(data)
    if err != nil {
      f.logger.Error("Write to target error", zap.Error(err))
      continue
    }

    n, err = targetConn.Read(data)
    if err != nil {
      f.logger.Error("Read from target error", zap.Error(err))
      continue
    }

    targetConn.Close()

    _, err = pc.WriteTo(data[:n], clientAddr)
    if err != nil {
      f.logger.Error("Write to client error", zap.Error(err))
    }
  }
}
