package cmd

import (
  "fmt"
  "os"

  "github.com/spf13/cobra"

  "github.com/Rxflex/Nimbus/agent/internal"
)

var rootCmd = &cobra.Command{
  Use:   "nimbus-agent",
  Short: "Nimbus Agent for GeoDNS and traffic forwarding",
  Long:  `Nimbus Agent CLI for registration, configuration polling, and systemd management.`,
  Run: func(cmd *cobra.Command, args []string) {
    fmt.Println("Nimbus Agent started")
    internal.RunAgent()
  },
}

func Execute() {
  err := rootCmd.Execute()
  if err != nil {
    os.Exit(1)
  }
}

func init() {
  rootCmd.PersistentFlags().StringVar(&internal.DirectorURL, "director", "http://localhost:3000", "Director API URL")
  rootCmd.PersistentFlags().StringVar(&internal.ApiKey, "api-key", "", "API Key for registration")
  rootCmd.PersistentFlags().StringVar(&internal.AgentName, "name", "", "Agent name")
}
