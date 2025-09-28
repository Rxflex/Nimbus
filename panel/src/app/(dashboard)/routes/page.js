'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute } from '@/hooks/use-routes';
import { useAgents } from '@/hooks/use-agents';

export default function RoutesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    destination: '',
    protocol: 'http',
    agents: [],
    sslConfig: {
      enabled: false,
      certificate: '',
      privateKey: '',
      verifyCertificate: true,
      allowSelfSigned: false
    }
  });

  const { data: routes = [], isLoading } = useRoutes();
  const { data: agents = [] } = useAgents();
  const createRouteMutation = useCreateRoute();
  const updateRouteMutation = useUpdateRoute();
  const deleteRouteMutation = useDeleteRoute();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingRoute) {
      updateRouteMutation.mutate(
        { id: editingRoute._id, data: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditingRoute(null);
            resetForm();
          }
        }
      );
    } else {
      createRouteMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    
    deleteRouteMutation.mutate(id);
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      source: route.source,
      destination: route.destination,
      protocol: route.protocol,
      agents: route.agents.map(a => a._id || a),
      sslConfig: route.sslConfig || {
        enabled: false,
        certificate: '',
        privateKey: '',
        verifyCertificate: true,
        allowSelfSigned: false
      }
    });
    setShowModal(true);
  };

  const handleAgentToggle = (agentId) => {
    setFormData({
      ...formData,
      agents: formData.agents.includes(agentId)
        ? formData.agents.filter(id => id !== agentId)
        : [...formData.agents, agentId]
    });
  };

  const handleSslConfigChange = (field, value) => {
    setFormData({
      ...formData,
      sslConfig: {
        ...formData.sslConfig,
        [field]: value
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      source: '',
      destination: '',
      protocol: 'http',
      agents: [],
      sslConfig: {
        enabled: false,
        certificate: '',
        privateKey: '',
        verifyCertificate: true,
        allowSelfSigned: false
      }
    });
  };

  if (isLoading && !routes.length) {
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
          <h1 className="text-xl sm:text-2xl font-bold">Routes</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage network routing configurations</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          ➕ Add Route
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
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Agents</TableHead>
                  <TableHead>SSL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route._id}>
                    <TableCell className="font-medium">
                      {route.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {route.source}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {route.destination}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {route.protocol.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {route.agents.map((agent, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {typeof agent === 'object' ? agent.name : 'Unknown'}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {route.protocol === 'http' && route.sslConfig?.enabled ? (
                        <Badge variant="default" className="text-xs">
                          SSL Enabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          No SSL
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(route)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(route._id)}
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
        {routes.map((route) => (
          <Card key={route._id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{route.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {route.protocol.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {route.agents.map((agent, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {typeof agent === 'object' ? agent.name : 'Unknown'}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Source</p>
                  <p className="text-sm break-all">{route.source}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Destination</p>
                  <p className="text-sm break-all">{route.destination}</p>
                </div>

                {route.protocol === 'http' && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">SSL Status</p>
                    <Badge variant={route.sslConfig?.enabled ? 'default' : 'secondary'} className="text-xs">
                      {route.sslConfig?.enabled ? 'SSL Enabled' : 'No SSL'}
                    </Badge>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(route)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(route._id)}
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
              {editingRoute ? 'Edit Route' : 'Add New Route'}
            </DialogTitle>
            <DialogDescription>
              {editingRoute ? 'Update route configuration' : 'Create a new network route'}
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
                placeholder="e.g., WebTraffic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                required
                placeholder="e.g., 0.0.0.0/0 or 192.168.1.1:80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                required
                placeholder="e.g., example.com or 10.0.0.1:443"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol</Label>
              <Select value={formData.protocol} onValueChange={(value) => setFormData({...formData, protocol: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="https">HTTPS</SelectItem>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Agents</Label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
                {agents.map((agent) => (
                  <label key={agent._id} className="flex items-center space-x-2 p-2 rounded border hover:bg-accent cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agents.includes(agent._id)}
                      onChange={() => handleAgentToggle(agent._id)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">
                      {agent.name} ({agent.ip}:{agent.port})
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* SSL Configuration for HTTP routes */}
            {formData.protocol === 'http' && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="routeSslEnabled"
                    checked={formData.sslConfig.enabled}
                    onChange={(e) => handleSslConfigChange('enabled', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="routeSslEnabled" className="text-sm font-medium">Enable HTTPS for this route</Label>
                </div>
                
                {formData.sslConfig.enabled && (
                  <div className="space-y-3 pl-6 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label htmlFor="routeCertificate">SSL Certificate</Label>
                      <textarea
                        id="routeCertificate"
                        value={formData.sslConfig.certificate}
                        onChange={(e) => handleSslConfigChange('certificate', e.target.value)}
                        placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                        className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="routePrivateKey">Private Key</Label>
                      <textarea
                        id="routePrivateKey"
                        value={formData.sslConfig.privateKey}
                        onChange={(e) => handleSslConfigChange('privateKey', e.target.value)}
                        placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                        className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm font-mono"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="verifyRouteCertificate"
                        checked={formData.sslConfig.verifyCertificate}
                        onChange={(e) => handleSslConfigChange('verifyCertificate', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="verifyRouteCertificate" className="text-sm">Verify SSL certificate</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allowRouteSelfSigned"
                        checked={formData.sslConfig.allowSelfSigned}
                        onChange={(e) => handleSslConfigChange('allowSelfSigned', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="allowRouteSelfSigned" className="text-sm">Allow self-signed certificates</Label>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingRoute(null);
                  resetForm();
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRouteMutation.isPending || updateRouteMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createRouteMutation.isPending || updateRouteMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {editingRoute ? 'Update Route' : 'Create Route'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
