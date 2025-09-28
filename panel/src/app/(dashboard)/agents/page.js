'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAgents, useCreateAgent, useUpdateAgent, useDeleteAgent } from '@/hooks/use-agents';

export default function AgentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: '',
    capabilities: {
      http: false,
      https: false,
      tcp: false,
      udp: false,
      dns: false
    }
  });

  const { data: agents = [], isLoading } = useAgents();
  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();
  const deleteAgentMutation = useDeleteAgent();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingAgent) {
      updateAgentMutation.mutate(
        { id: editingAgent._id, data: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditingAgent(null);
            resetForm();
          }
        }
      );
    } else {
      createAgentMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    
    deleteAgentMutation.mutate(id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      ip: '',
      port: '',
      capabilities: {
        http: false,
        https: false,
        tcp: false,
        udp: false,
        dns: false
      }
    });
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      ip: agent.ip,
      port: agent.port,
      capabilities: agent.capabilities
    });
    setShowModal(true);
  };

  const handleCapabilityChange = (capability) => {
    setFormData({
      ...formData,
      capabilities: {
        ...formData.capabilities,
        [capability]: !formData.capabilities[capability]
      }
    });
  };

  if (isLoading && !agents.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Agents</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your network agents</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          ➕ Add Agent
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP:Port</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capabilities</TableHead>
                  <TableHead>Last Heartbeat</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent._id}>
                    <TableCell className="font-medium">
                      {agent.name}
                    </TableCell>
                    <TableCell>
                      {agent.ip}:{agent.port}
                    </TableCell>
                    <TableCell>
                      <Badge variant={agent.status === 'connected' ? 'default' : 'destructive'}>
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(agent.capabilities).map(([cap, enabled]) => (
                          enabled && (
                            <Badge key={cap} variant="secondary" className="text-xs">
                              {cap.toUpperCase()}
                            </Badge>
                          )
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(agent.lastHeartbeat).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(agent)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(agent._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {agents.map((agent) => (
          <Card key={agent._id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.ip}:{agent.port}</p>
                  </div>
                  <Badge variant={agent.status === 'connected' ? 'default' : 'destructive'}>
                    {agent.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Capabilities</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(agent.capabilities).map(([cap, enabled]) => (
                      enabled && (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap.toUpperCase()}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Last Heartbeat</p>
                  <p className="text-sm">{new Date(agent.lastHeartbeat).toLocaleString()}</p>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(agent)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(agent._id)}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAgent ? 'Edit Agent' : 'Add New Agent'}
            </DialogTitle>
            <DialogDescription>
              {editingAgent ? 'Update agent configuration' : 'Create a new network agent'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Enter agent name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                type="text"
                value={formData.ip}
                onChange={(e) => setFormData({...formData, ip: e.target.value})}
                required
                placeholder="192.168.1.100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({...formData, port: parseInt(e.target.value)})}
                required
                placeholder="8080"
                min="1"
                max="65535"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Capabilities</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formData.capabilities).map((cap) => (
                  <label key={cap} className="flex items-center space-x-2 p-2 rounded border hover:bg-accent cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.capabilities[cap]}
                      onChange={() => handleCapabilityChange(cap)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">{cap.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingAgent(null);
                  resetForm();
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAgentMutation.isPending || updateAgentMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createAgentMutation.isPending || updateAgentMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {editingAgent ? 'Update Agent' : 'Create Agent'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
