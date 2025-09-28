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
import { useGeoDns, useCreateGeoDns, useUpdateGeoDns, useDeleteGeoDns } from '@/hooks/use-geodns';
import { useRoutes } from '@/hooks/use-routes';
import { useAgents } from '@/hooks/use-agents';

export default function GeoDnsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingGeoDns, setEditingGeoDns] = useState(null);
  const [formData, setFormData] = useState({
    domain: '',
    recordType: 'A',
    target: '',
    location: {
      country: '',
      region: '',
      city: ''
    },
    anycast: false,
    routes: [],
    agents: []
  });

  const { data: geodns = [], isLoading } = useGeoDns();
  const { data: routes = [] } = useRoutes();
  const { data: agents = [] } = useAgents();
  const createGeoDnsMutation = useCreateGeoDns();
  const updateGeoDnsMutation = useUpdateGeoDns();
  const deleteGeoDnsMutation = useDeleteGeoDns();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingGeoDns) {
      updateGeoDnsMutation.mutate(
        { id: editingGeoDns._id, data: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditingGeoDns(null);
            resetForm();
          }
        }
      );
    } else {
      createGeoDnsMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this GeoDNS configuration?')) return;
    
    deleteGeoDnsMutation.mutate(id);
  };

  const handleEdit = (geoDns) => {
    setEditingGeoDns(geoDns);
    setFormData({
      domain: geoDns.domain,
      recordType: geoDns.recordType,
      target: geoDns.target,
      location: geoDns.location || { country: '', region: '', city: '' },
      anycast: geoDns.anycast || false,
      routes: geoDns.routes?.map(r => r._id || r) || [],
      agents: geoDns.agents?.map(a => a._id || a) || []
    });
    setShowModal(true);
  };

  const handleLocationChange = (field, value) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [field]: value
      }
    });
  };

  const handleArrayToggle = (arrayName, itemId) => {
    setFormData({
      ...formData,
      [arrayName]: formData[arrayName].includes(itemId)
        ? formData[arrayName].filter(id => id !== itemId)
        : [...formData[arrayName], itemId]
    });
  };

  const resetForm = () => {
    setFormData({
      domain: '',
      recordType: 'A',
      target: '',
      location: {
        country: '',
        region: '',
        city: ''
      },
      anycast: false,
      routes: [],
      agents: []
    });
  };

  if (isLoading && !geodns.length) {
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
          <h1 className="text-xl sm:text-2xl font-bold">GeoDNS</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage geographic DNS configurations</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          ➕ Add GeoDNS
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Anycast</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {geodns.map((geo) => (
                  <TableRow key={geo._id}>
                    <TableCell className="font-medium">
                      {geo.domain}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {geo.recordType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {geo.target}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {geo.location ?
                        `${geo.location.city}, ${geo.location.region}, ${geo.location.country}`
                        : 'Not specified'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={geo.anycast ? 'default' : 'secondary'} className="text-xs">
                        {geo.anycast ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(geo)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(geo._id)}
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
        {geodns.map((geo) => (
          <Card key={geo._id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{geo.domain}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {geo.recordType}
                    </Badge>
                  </div>
                  <Badge variant={geo.anycast ? 'default' : 'secondary'} className="text-xs">
                    {geo.anycast ? 'Anycast Enabled' : 'No Anycast'}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Target</p>
                  <p className="text-sm break-all">{geo.target}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Location</p>
                  <p className="text-sm">
                    {geo.location ?
                      `${geo.location.city}, ${geo.location.region}, ${geo.location.country}`
                      : 'Not specified'
                    }
                  </p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(geo)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(geo._id)}
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
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGeoDns ? 'Edit GeoDNS' : 'Add New GeoDNS'}
            </DialogTitle>
            <DialogDescription>
              {editingGeoDns ? 'Update GeoDNS configuration' : 'Create a new geographic DNS entry'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  required
                  placeholder="e.g., example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordType">Record Type</Label>
                <Select value={formData.recordType} onValueChange={(value) => setFormData({...formData, recordType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="CNAME">CNAME</SelectItem>
                    <SelectItem value="MX">MX</SelectItem>
                    <SelectItem value="TXT">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="text"
                value={formData.target}
                onChange={(e) => setFormData({...formData, target: e.target.value})}
                required
                placeholder="e.g., 192.0.2.1 or hostname.example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Location (Optional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => handleLocationChange('country', e.target.value)}
                  placeholder="Country (e.g., US)"
                />
                <Input
                  type="text"
                  value={formData.location.region}
                  onChange={(e) => handleLocationChange('region', e.target.value)}
                  placeholder="Region (e.g., California)"
                />
                <Input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  placeholder="City (e.g., San Francisco)"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anycast"
                checked={formData.anycast}
                onChange={(e) => setFormData({...formData, anycast: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="anycast" className="text-sm font-medium">Enable Anycast</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Routes (Optional)</Label>
                <div className="max-h-40 overflow-y-auto p-2 border rounded-md space-y-1">
                  {routes.map((route) => (
                    <label key={route._id} className="flex items-center space-x-2 hover:bg-accent rounded p-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.routes.includes(route._id)}
                        onChange={() => handleArrayToggle('routes', route._id)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{route.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Agents (Optional)</Label>
                <div className="max-h-40 overflow-y-auto p-2 border rounded-md space-y-1">
                  {agents.map((agent) => (
                    <label key={agent._id} className="flex items-center space-x-2 hover:bg-accent rounded p-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agents.includes(agent._id)}
                        onChange={() => handleArrayToggle('agents', agent._id)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{agent.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingGeoDns(null);
                  resetForm();
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGeoDnsMutation.isPending || updateGeoDnsMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createGeoDnsMutation.isPending || updateGeoDnsMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {editingGeoDns ? 'Update GeoDNS' : 'Create GeoDNS'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
