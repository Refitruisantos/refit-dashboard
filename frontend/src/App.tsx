import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClientesPage } from '@/pages/ClientesPage';
import { ServicosPage } from '@/pages/ServicosPage';
import { PagamentosPage } from '@/pages/PagamentosPage';
import { AgendaPage } from '@/pages/AgendaPage';
import { DespesasPage } from '@/pages/DespesasPage';
import { RelatoriosPage } from '@/pages/RelatoriosPage';
import { FluxoCaixaPage } from '@/pages/FluxoCaixaPage';
import { ObjetivosPage } from '@/pages/ObjetivosPage';
import { ConfiguracoesPage } from '@/pages/ConfiguracoesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'clientes':
        return <ClientesPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'servicos':
        return <ServicosPage />;
      case 'pagamentos':
        return <PagamentosPage />;
      case 'despesas':
        return <DespesasPage />;
      case 'fluxo-caixa':
        return <FluxoCaixaPage />;
      case 'relatorios':
        return <RelatoriosPage />;
      case 'objetivos':
        return <ObjetivosPage />;
      case 'configuracoes':
        return <ConfiguracoesPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
            {renderPage()}
          </MainLayout>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
