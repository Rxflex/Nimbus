package internal

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"sync"
	"time"

	"go.uber.org/zap"
)

var (
	DirectorURL string
	ApiKey      string
	AgentName   string
	logger      *zap.Logger
	config      ConfigResponse
	agentID     string
	mu          sync.Mutex
)

type ConfigResponse struct {
	GeoDns []interface{} `json:"geodns"`
	Routes []interface{} `json:"routes"`
	Rules  []interface{} `json:"rules"`
}

type Capabilities struct {
	Http  bool `json:"http"`
	Https bool `json:"https"`
	Tcp   bool `json:"tcp"`
	Udp   bool `json:"udp"`
	Dns   bool `json:"dns"`
}

func InitLogger() {
	l, _ := zap.NewProduction()
	logger = l
	defer logger.Sync()
}

func RegisterAgent() error {
	// Auto-detect local IP
	ip, err := getLocalIP()
	if err != nil {
		return fmt.Errorf("failed to get local IP: %v", err)
	}

	// Default capabilities - all enabled
	capabilities := Capabilities{
		Http:  true,
		Https: true,
		Tcp:   true,
		Udp:   true,
		Dns:   true,
	}

	url := fmt.Sprintf("%s/agent/%s/register", DirectorURL, ApiKey)
	payload := map[string]interface{}{
		"ip":           ip,
		"port":         8080, // Default port
		"capabilities": capabilities,
	}

	if AgentName != "" {
		payload["name"] = AgentName
	}

	jsonData, _ := json.Marshal(payload)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("registration failed: %d", resp.StatusCode)
	}

	var result map[string]string
	json.NewDecoder(resp.Body).Decode(&result)
	agentID = result["agentId"]
	log.Printf("Agent registered with ID: %s, IP: %s", agentID, ip)
	return nil
}

func PollConfig() error {
	url := fmt.Sprintf("%s/agent/%s/config", DirectorURL, ApiKey)
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("config poll failed: %d", resp.StatusCode)
	}

	err = json.NewDecoder(resp.Body).Decode(&config)
	if err != nil {
		return err
	}

	log.Println("Config polled successfully")
	return nil
}

func SyncRoutes() {
	// Implement route sync logic based on config.Routes
	log.Println("Syncing routes...")
	// For now, log
	for _, r := range config.Routes {
		log.Printf("Sync route: %v", r)
		// Launch forwarding for each route if capabilities allow
	}
}

func SetupSystemd() error {
	if len(os.Args) > 1 && os.Args[1] == "install" {
		// Install as systemd service
		serviceFile := `[Unit]
Description=Nimbus Agent
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/nimbus-agent --director ` + DirectorURL + ` --api-key ` + ApiKey + ` --name ` + AgentName + `
ExecStop=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`

		err := os.WriteFile("/etc/systemd/system/nimbus-agent.service", []byte(serviceFile), 0644)
		if err != nil {
			return err
		}

		cmd := exec.Command("systemd-run", "--unit=nimbus-agent", "--service-type=simple", "/usr/local/bin/nimbus-agent", fmt.Sprintf("--director=%s", DirectorURL), fmt.Sprintf("--api-key=%s", ApiKey), fmt.Sprintf("--name=%s", AgentName))
		return cmd.Run()

	}
	return nil
}

func Heartbeat() {
	ticker := time.NewTicker(30 * time.Second)
	for range ticker.C {
		url := fmt.Sprintf("%s/agent/heartbeat", DirectorURL)
		payload := map[string]interface{}{
			"agentId":      agentID,
			"capabilities": Capabilities{ /* from config or global */ },
		}

		jsonData, _ := json.Marshal(payload)
		resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
		if err == nil {
			resp.Body.Close()
		}
	}
}

func RunAgent() {
	InitLogger()

	if err := RegisterAgent(); err != nil {
		log.Fatal("Failed to register agent:", err)
	}

	if err := SetupSystemd(); err != nil {
		log.Fatal("Failed to setup systemd:", err)
	}

	// Poll config in loop
	for {
		if err := PollConfig(); err == nil {
			SyncRoutes()
			// Start DNS server if dns capability
			geoDNS := NewGeoDNSServer(logger, config)
			geoDNS.Start()

			// Start forwarding for routes
			forwarder := NewForwarder(logger, config)
			for _, route := range config.Routes {
				// Assume route has listen and target
				rMap, _ := route.(map[string]interface{})
				source, _ := rMap["source"].(string)
				destination, _ := rMap["destination"].(string)
				go func() {
					if err := forwarder.StartTCPProxy(source, destination); err != nil {
						log.Println("TCP forward error:", err)
					}
				}()
			}

			// Start monitoring
			go Heartbeat()
			select {} // Run forever
		}

		time.Sleep(1 * time.Minute) // Poll every minute
	}
}

func getLocalIP() (string, error) {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return "", err
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String(), nil
}
