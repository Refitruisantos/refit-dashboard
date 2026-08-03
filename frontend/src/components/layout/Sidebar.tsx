import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText, 
  LayoutDashboard, 
  Receipt, 
  Settings, 
  Target, 
  Users 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'servicos', label: 'Serviços', icon: BarChart3 },
  { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
  { id: 'despesas', label: 'Despesas', icon: Receipt },
  { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: DollarSign },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'objetivos', label: 'Objetivos', icon: Target },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col bg-navy-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-navy-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shadow-lg backdrop-blur-sm">
          <img src="/logo.svg" alt="REFIT" className="h-full w-full brightness-0 invert text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">REFIT</h1>
          <p className="text-xs text-navy-300">Studio Manager</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-navy-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.5} />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-success" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border/40 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-chart-2 to-chart-5 text-xs font-semibold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Admin</p>
            <p className="truncate text-2xs text-muted-foreground">admin@refit.pt</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
