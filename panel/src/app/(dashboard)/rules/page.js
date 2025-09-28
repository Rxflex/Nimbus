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
import { useRules, useCreateRule, useUpdateRule, useDeleteRule } from '@/hooks/use-rules';
import { useAgents } from '@/hooks/use-agents';

export default function RulesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'http',
    match: '',
    action: 'proxy',
    target: '',
    agent: '',
    sslConfig: {
      enabled: false,
      verifyCertificate: true,
      allowSelfSigned: false
    }
  });

  const { data: rules = [], isLoading } = useRules();
  const { data: agents = [] } = useAgents();
  const createRuleMutation = useCreateRule();
  const updateRuleMutation = useUpdateRule();
  const deleteRuleMutation = useDeleteRule();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingRule) {
      updateRuleMutation.mutate(
        { id: editingRule._id, data: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditingRule(null);
            resetForm();
          }
        }
      );
    } else {
      createRuleMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    
    deleteRuleMutation.mutate(id);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      type: rule.type,
      match: rule.match,
      action: rule.action,
      target: rule.target,
      agent: rule.agent._id || rule.agent,
      sslConfig: rule.sslConfig || {
        enabled: false,
        verifyCertificate: true,
        allowSelfSigned: false
      }
    });
    setShowModal(true);
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
      type: 'http',
      match: '',
      action: 'proxy',
      target: '',
      agent: '',
      sslConfig: {
        enabled: false,
        verifyCertificate: true,
        allowSelfSigned: false
      }
    });
  };

  if (isLoading && !rules.length) {
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
          <h1 className="text-xl sm:text-2xl font-bold">Rules</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage routing and filtering rules</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          ➕ Add Rule
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
                  <TableHead>Type</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>SSL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule._id}>
                    <TableCell className="font-medium">
                      {rule.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {rule.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {rule.match}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          rule.action === 'block'
                            ? 'destructive'
                            : rule.action === 'redirect'
                              ? 'secondary'
                              : 'default'
                        }
                        className="text-xs"
                      >
                        {rule.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {rule.target}
                    </TableCell>
                    <TableCell>
                      {typeof rule.agent === 'object' ? rule.agent.name : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {(rule.type === 'http' || rule.type === 'https') && rule.sslConfig?.enabled ? (
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
                          onClick={() => handleEdit(rule)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rule._id)}
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
        {rules.map((rule) => (
          <Card key={rule._id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {rule.type.toUpperCase()}
                    </Badge>
                  </div>
                  <Badge
                    variant={
                      rule.action === 'block'
                        ? 'destructive'
                        : rule.action === 'redirect'
                          ? 'secondary'
                          : 'default'
                    }
                    className="text-xs"
                  >
                    {rule.action}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Match</p>
                  <p className="text-sm break-all">{rule.match}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Target</p>
                  <p className="text-sm break-all">{rule.target}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Agent</p>
                  <p className="text-sm">{typeof rule.agent === 'object' ? rule.agent.name : 'Unknown'}</p>
                </div>

                {(rule.type === 'http' || rule.type === 'https') && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">SSL Status</p>
                    <Badge variant={rule.sslConfig?.enabled ? 'default' : 'secondary'} className="text-xs">
                      {rule.sslConfig?.enabled ? 'SSL Enabled' : 'No SSL'}
                    </Badge>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(rule)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(rule._id)}
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
              {editingRule ? 'Edit Rule' : 'Add New Rule'}
            </DialogTitle>
            <DialogDescription>
              {editingRule ? 'Update rule configuration' : 'Create a new network rule'}
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
                placeholder="e.g., BlockMalware"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="https">HTTPS</SelectItem>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="dns">DNS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="match">Match Pattern</Label>
              <Input
                id="match"
                type="text"
                value={formData.match}
                onChange={(e) => setFormData({...formData, match: e.target.value})}
                required
                placeholder="e.g., *.ads.com or /api/v1/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={formData.action} onValueChange={(value) => setFormData({...formData, action: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proxy">Proxy</SelectItem>
                  <SelectItem value="redirect">Redirect</SelectItem>
                  <SelectItem value="block">Block</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="text"
                value={formData.target}
                onChange={(e) => setFormData({...formData, target: e.target.value})}
                required
                placeholder="e.g., 192.168.1.100:80 or example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Agent</Label>
              <Select value={formData.agent} onValueChange={(value) => setFormData({...formData, agent: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent._id} value={agent._id}>
                      {agent.name} ({agent.ip}:{agent.port})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SSL Configuration for HTTP/HTTPS rules */}
            {(formData.type === 'http' || formData.type === 'https') && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ruleSslEnabled"
                    checked={formData.sslConfig.enabled}
                    onChange={(e) => handleSslConfigChange('enabled', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="ruleSslEnabled" className="text-sm font-medium">Enable SSL/TLS for this rule</Label>
                </div>

                {formData.sslConfig.enabled && (
                  <div className="space-y-3 pl-6 border-l-2 border-muted">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="verifyCertificate"
                        checked={formData.sslConfig.verifyCertificate}
                        onChange={(e) => handleSslConfigChange('verifyCertificate', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="verifyCertificate" className="text-sm">Verify SSL certificate</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allowSelfSigned"
                        checked={formData.sslConfig.allowSelfSigned}
                        onChange={(e) => handleSslConfigChange('allowSelfSigned', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="allowSelfSigned" className="text-sm">Allow self-signed certificates</Label>
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
                  setEditingRule(null);
                  resetForm();
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRuleMutation.isPending || updateRuleMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createRuleMutation.isPending || updateRuleMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
