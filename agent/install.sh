#!/bin/bash

# Nimbus Agent Installation Script
# Usage: ./install.sh http://director_url/api/agent/AGENT_KEY [agent_name]

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <director_url> [agent_name]"
    echo "Example: $0 http://director.example.com/api/agent/your_api_key"
    echo "Example: $0 http://director.example.com/api/agent/your_api_key my-agent"
    exit 1
fi

DIRECTOR_URL="$1"
AGENT_NAME="${2:-}"

echo "Installing Nimbus Agent..."
echo "Director URL: $DIRECTOR_URL"
if [ -n "$AGENT_NAME" ]; then
    echo "Agent Name: $AGENT_NAME"
fi

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use sudo)"
    exit 1
fi

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        ARCH="amd64"
        ;;
    aarch64|arm64)
        ARCH="arm64"
        ;;
    armv7l)
        ARCH="arm"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

echo "Detected architecture: $ARCH"

# Download and install agent binary
BINARY_URL="https://github.com/Rxflex/Nimbus/releases/latest/download/nimbus-agent-${ARCH}"
echo "Downloading agent binary from: $BINARY_URL"

curl -L -o /usr/local/bin/nimbus-agent "$BINARY_URL"
chmod +x /usr/local/bin/nimbus-agent

# Create systemd service
SERVICE_FILE="/etc/systemd/system/nimbus-agent.service"
cat > "$SERVICE_FILE" << EOF
[Unit]
Description=Nimbus Agent
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/nimbus-agent --director $DIRECTOR_URL --api-key $(echo $DIRECTOR_URL | sed 's/.*\/agent\///') --name $AGENT_NAME
ExecStop=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
systemctl daemon-reload
systemctl enable nimbus-agent
systemctl start nimbus-agent

echo "Nimbus Agent installed and started successfully!"
echo "Check status with: systemctl status nimbus-agent"
echo "View logs with: journalctl -u nimbus-agent -f"
