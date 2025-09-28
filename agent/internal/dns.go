package internal

import (
  "context"
  "fmt"
  "net"

  "github.com/miekg/dns"
)

type GeoDNSServer struct {
  logger   *zap.Logger
  config   ConfigResponse
  listener *net.Listener
}

func NewGeoDNSServer(logger *zap.Logger, config ConfigResponse) *GeoDNSServer {
  return &GeoDNSServer{
    logger: logger,
    config: config,
  }
}

func (s *GeoDNSServer) Start() error {
  dns.HandleFunc(".", s.handleDNS)
  udpServer := &dns.Server{Addr: "0.0.0.0:53", Net: "udp"}
  tcpServer := &dns.Server{Addr: "0.0.0.0:53", Net: "tcp"}
  go func() {
    if err := udpServer.ListenAndServe(); err != nil {
      s.logger.Error("UDP DNS server failed", zap.Error(err))
    }
  }()
  go func() {
    if err := tcpServer.ListenAndServe(); err != nil {
      s.logger.Error("TCP DNS server failed", zap.Error(err))
    }
  }()
  s.logger.Info("GeoDNS server started on port 53")
  return nil
}

func (s *GeoDNSServer) Stop() error {
  dns.HandleFunc(".", func(dns.ResponseWriter, *dns.Msg) {})
  return nil
}

func (s *GeoDNSServer) handleDNS(w dns.ResponseWriter, r *dns.Msg) {
  m := new(dns.Msg)
  m.SetReply(r)
  m.Authoritative = true

  domain := r.Question[0].Name
  qtype := r.Question[0].Qtype

  // Lookup in config for geo-specific responses
  for _, g := range s.config.GeoDns {
    // Assume g is map[string]interface{}
    gMap, ok := g.(map[string]interface{})
    if !ok {
      continue
    }
    gDomain, ok := gMap["domain"].(string)
    if !ok || gDomain != domain {
      continue
    }
    gType, ok := gMap["recordType"].(string)
    if !ok || gType != dns.TypeToString[qtype] {
      continue
    }
    target, ok := gMap["target"].(string)
    if ok {
      rr := s.createRecord(qtype, domain, target)
      m.Answer = append(m.Answer, rr)
    }
  }

  if len(m.Answer) == 0 {
    m.SetRcode(r, dns.RcodeNameError)
  }

  w.WriteMsg(m)
}

func (s *GeoDNSServer) createRecord(qtype uint16, domain, target string) dns.RR {
  switch qtype {
  case dns.TypeA:
    return &dns.A{
      Hdr: dns.RR_Header{Name: domain, Rrtype: dns.TypeA, Class: dns.ClassINET, Ttl: 300},
      A:   net.ParseIP(target),
    }
  case dns.TypeCNAME:
    return &dns.CNAME{
      Hdr: dns.RR_Header{Name: domain, Rrtype: dns.TypeCNAME, Class: dns.ClassINET, Ttl: 300},
      Target: target + ".",
    }
  // Add other types as needed
  default:
    return nil
  }
}
