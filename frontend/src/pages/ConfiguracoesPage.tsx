import { useState } from 'react';
import { Settings, Building2, DollarSign, Tag, Save, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings, useUpdateSettings, useCategories, useCreateCategory, useToggleCategory, useDeleteCategory } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

type TabType = 'company' | 'financial' | 'categories';

export function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    type: 'expense' as 'expense' | 'revenue' | 'agenda' | 'goal',
    color: '#3b82f6',
  });
  
  const { data: settings, isLoading } = useSettings();
  const { data: categories = [] } = useCategories();
  const updateSettings = useUpdateSettings();
  const createCategory = useCreateCategory();
  const toggleCategory = useToggleCategory();
  const deleteCategory = useDeleteCategory();

  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyNif: '',
    companyWebsite: '',
    currency: 'EUR',
    initialBalance: 0,
    initialBalanceDate: new Date().toISOString().split('T')[0],
    fiscalYear: new Date().getFullYear(),
    dateFormat: 'dd/MM/yyyy',
    firstDayOfWeek: 1,
  });

  // Atualizar form quando settings carregarem
  useState(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        companyEmail: settings.companyEmail || '',
        companyPhone: settings.companyPhone || '',
        companyAddress: settings.companyAddress || '',
        companyNif: settings.companyNif || '',
        companyWebsite: settings.companyWebsite || '',
        currency: settings.currency || 'EUR',
        initialBalance: settings.initialBalance || 0,
        initialBalanceDate: settings.initialBalanceDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        fiscalYear: settings.fiscalYear || new Date().getFullYear(),
        dateFormat: settings.dateFormat || 'dd/MM/yyyy',
        firstDayOfWeek: settings.firstDayOfWeek || 1,
      });
    }
  });

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      alert('Configurações guardadas com sucesso!');
    } catch (error) {
      alert('Erro ao guardar configurações');
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Nome da categoria é obrigatório');
      return;
    }

    try {
      await createCategory.mutateAsync(categoryForm);
      setCategoryForm({ name: '', type: 'expense', color: '#3b82f6' });
      setShowCategoryForm(false);
      alert('Categoria criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar categoria');
    }
  };

  const handleToggleCategory = async (id: string) => {
    try {
      await toggleCategory.mutateAsync(id);
    } catch (error) {
      alert('Erro ao alterar estado da categoria');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar esta categoria?')) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error) {
        alert('Erro ao eliminar categoria');
      }
    }
  };

  const tabs = [
    { id: 'company', label: 'Dados da Empresa', icon: Building2 },
    { id: 'financial', label: 'Configurações Financeiras', icon: DollarSign },
    { id: 'categories', label: 'Categorias', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                <Settings className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Configurações</h1>
                <p className="text-sm text-muted-foreground">Gerir dados e preferências</p>
              </div>
            </div>
            <Button onClick={handleSave} className="gap-2" disabled={updateSettings.isPending}>
              <Save className="h-4 w-4" />
              {updateSettings.isPending ? 'A guardar...' : 'Guardar Alterações'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
                className={cn('flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap',
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">A carregar configurações...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Tab: Dados da Empresa */}
            {activeTab === 'company' && (
              <Card>
                <CardHeader title="Dados da Empresa" subtitle="Informações da REFIT" />
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Nome da Empresa *</label>
                      <input type="text" value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="REFIT Studio" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Email</label>
                      <input type="email" value={formData.companyEmail}
                        onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="info@refit.pt" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Telefone</label>
                      <input type="tel" value={formData.companyPhone}
                        onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="+351 123 456 789" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">NIF</label>
                      <input type="text" value={formData.companyNif}
                        onChange={(e) => setFormData({ ...formData, companyNif: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="123456789" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium">Morada</label>
                      <input type="text" value={formData.companyAddress}
                        onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Rua Example, 123, Lisboa" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium">Website</label>
                      <input type="url" value={formData.companyWebsite}
                        onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="https://www.refit.pt" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab: Configurações Financeiras */}
            {activeTab === 'financial' && (
              <Card>
                <CardHeader title="Configurações Financeiras" subtitle="Moeda e saldo inicial" />
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Moeda</label>
                      <select value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Ano Fiscal</label>
                      <input type="number" value={formData.fiscalYear}
                        onChange={(e) => setFormData({ ...formData, fiscalYear: parseInt(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Saldo Inicial (€)</label>
                      <input type="number" step="0.01" value={formData.initialBalance}
                        onChange={(e) => setFormData({ ...formData, initialBalance: parseFloat(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0.00" />
                      <p className="mt-1 text-xs text-muted-foreground">Saldo em caixa/banco no início do período</p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Data do Saldo Inicial</label>
                      <input type="date" value={formData.initialBalanceDate}
                        onChange={(e) => setFormData({ ...formData, initialBalanceDate: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Formato de Datas</label>
                      <select value={formData.dateFormat}
                        onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                        <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                        <option value="yyyy-MM-dd">AAAA-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Primeiro Dia da Semana</label>
                      <select value={formData.firstDayOfWeek}
                        onChange={(e) => setFormData({ ...formData, firstDayOfWeek: parseInt(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="0">Domingo</option>
                        <option value="1">Segunda-feira</option>
                        <option value="6">Sábado</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab: Categorias */}
            {activeTab === 'categories' && (
              <Card>
                <CardHeader title="Gestão de Categorias" subtitle={`${categories.length} categorias`} />
                <CardContent>
                  {/* Formulário Nova Categoria */}
                  {showCategoryForm ? (
                    <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Nova Categoria</h3>
                        <button onClick={() => setShowCategoryForm(false)} className="rounded p-1 hover:bg-muted">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Nome *</label>
                          <input type="text" value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Ex: Renda" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Tipo *</label>
                          <select value={categoryForm.type}
                            onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as any })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="expense">Despesa</option>
                            <option value="revenue">Receita</option>
                            <option value="agenda">Agenda</option>
                            <option value="goal">Objetivo</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Cor</label>
                          <input type="color" value={categoryForm.color}
                            onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                            className="h-10 w-full rounded-lg border border-border bg-background px-2 py-1" />
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button onClick={handleCreateCategory} disabled={createCategory.isPending}>
                          {createCategory.isPending ? 'A criar...' : 'Criar Categoria'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowCategoryForm(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <Button onClick={() => setShowCategoryForm(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nova Categoria
                      </Button>
                    </div>
                  )}

                  {/* Lista de Categorias */}
                  {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Tag className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">Nenhuma categoria criada</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div className="flex items-center gap-3">
                            {category.color && (
                              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
                            )}
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{category.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleCategory(category.id)}
                              className={cn('rounded px-2 py-1 text-xs font-medium transition-colors',
                                category.active ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-muted text-muted-foreground hover:bg-muted/80')}>
                              {category.active ? 'Ativa' : 'Inativa'}
                            </button>
                            <button onClick={() => handleDeleteCategory(category.id)}
                              className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
