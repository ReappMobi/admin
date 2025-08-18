import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/_auth/donations')({
  component: RouteComponent,
});

export enum DonationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export type Donation = {
  id: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
  status: DonationStatus;
  paymentTransactionId: string;
  paymentCheckoutUrl: string;
  projectId?: number;
  institutionId?: number;
  donorId: number;
  project?: Project;
  institution?: Institution;
  donor: Donor;
};

export type Donor = {
  id: number;
  accountId: number;
  account: Account;
};

export type Account = {
  id: number;
  name: string;
  email: string;
};

export type Institution = {
  id: number;
  account: Account;
};

export type Project = {
  id: number;
  name: string;
  institutionId: number;
  institution: Institution;
};

const mockDonations: Donation[] = [
  {
    id: 1,
    amount: 150.50,
    createdAt: '2024-05-15T10:30:00Z',
    updatedAt: '2024-05-15T10:30:00Z',
    status: DonationStatus.COMPLETED,
    paymentTransactionId: 'txn_123456789',
    paymentCheckoutUrl: 'https://example.com/checkout/txn_123456789',
    donorId: 1,
    projectId: 1,
    donor: {
      id: 1,
      accountId: 1,
      account: {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
      },
    },
    project: {
      id: 1,
      name: 'Projeto Educar',
      institutionId: 1,
      institution: {
        id: 1,
        account: {
          id: 2,
          name: 'Instituição Esperança',
          email: 'instituicao@example.com',
        },
      },
    },
  },
  {
    id: 2,
    amount: 200.00,
    createdAt: '2024-05-20T14:45:00Z',
    updatedAt: '2024-05-20T14:45:00Z',
    status: DonationStatus.PENDING,
    paymentTransactionId: 'txn_987654321',
    paymentCheckoutUrl: 'https://example.com/checkout/txn_987654321',
    donorId: 2,
    institutionId: 2,
    donor: {
      id: 2,
      accountId: 3,
      account: {
        id: 3,
        name: 'Maria Oliveira',
        email: 'maria@example.com',
      },
    },
    institution: {
      id: 2,
      account: {
        id: 4,
        name: 'ONG Solidária',
        email: 'ong@example.com',
      },
    },
  },
  {
    id: 3,
    amount: 75.25,
    createdAt: '2024-04-10T09:15:00Z',
    updatedAt: '2024-04-10T09:15:00Z',
    status: DonationStatus.COMPLETED,
    paymentTransactionId: 'txn_555444333',
    paymentCheckoutUrl: 'https://example.com/checkout/txn_555444333',
    donorId: 3,
    projectId: 2,
    donor: {
      id: 3,
      accountId: 5,
      account: {
        id: 5,
        name: 'Carlos Mendes',
        email: 'carlos@example.com',
      },
    },
    project: {
      id: 2,
      name: 'Alimentando Famílias',
      institutionId: 3,
      institution: {
        id: 3,
        account: {
          id: 6,
          name: 'Banco de Alimentos',
          email: 'alimentos@example.com',
        },
      },
    },
  },
  {
    id: 4,
    amount: 300.00,
    createdAt: '2024-05-25T16:20:00Z',
    updatedAt: '2024-05-25T16:20:00Z',
    status: DonationStatus.FAILED,
    paymentTransactionId: 'txn_111222333',
    paymentCheckoutUrl: 'https://example.com/checkout/txn_111222333',
    donorId: 4,
    institutionId: 4,
    donor: {
      id: 4,
      accountId: 7,
      account: {
        id: 7,
        name: 'Ana Pereira',
        email: 'ana@example.com',
      },
    },
    institution: {
      id: 4,
      account: {
        id: 8,
        name: 'Abrigo Animal',
        email: 'abrigo@example.com',
      },
    },
  },
  {
    id: 5,
    amount: 50.00,
    createdAt: '2024-05-01T08:00:00Z',
    updatedAt: '2024-05-01T08:00:00Z',
    status: DonationStatus.CANCELLED,
    paymentTransactionId: 'txn_999888777',
    paymentCheckoutUrl: 'https://example.com/checkout/txn_999888777',
    donorId: 5,
    projectId: 3,
    donor: {
      id: 5,
      accountId: 9,
      account: {
        id: 9,
        name: 'Pedro Santos',
        email: 'pedro@example.com',
      },
    },
    project: {
      id: 3,
      name: 'Cultura para Todos',
      institutionId: 1,
      institution: {
        id: 1,
        account: {
          id: 2,
          name: 'Instituição Esperança',
          email: 'instituicao@example.com',
        },
      },
    },
  },
];


function RouteComponent() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredDonations = mockDonations.filter(donation => {
    if (dateRange?.from && dateRange?.to) {
      const donationDate = new Date(donation.createdAt);
      if (donationDate < dateRange.from || donationDate > dateRange.to) {
        return false;
      }
    }
    
    if (statusFilter !== 'all' && donation.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const donorMatch = donation.donor.account.name.toLowerCase().includes(searchLower);
      const institutionMatch = donation.institution?.account.name.toLowerCase().includes(searchLower) || false;
      const projectMatch = donation.project?.name.toLowerCase().includes(searchLower) || false;
      
      return donorMatch || institutionMatch || projectMatch;
    }
    
    return true;
  });


  const totalDonations = mockDonations.length;
  const lastMonthDonations = mockDonations.filter(d => {
    const donationDate = new Date(d.createdAt);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return donationDate > oneMonthAgo;
  }).length;
  
  const totalAmount = mockDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const lastMonthAmount = mockDonations.filter(d => {
    const donationDate = new Date(d.createdAt);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return donationDate > oneMonthAgo;
  }).reduce((sum, donation) => sum + donation.amount, 0);
  
  const completedDonations = mockDonations.filter(d => d.status === DonationStatus.COMPLETED).length;
  const pendingDonations = mockDonations.filter(d => d.status === DonationStatus.PENDING).length;

  const primaryColor = '#7B9D7C';
  const primaryLight = 'rgba(123, 157, 124, 0.1)';
  const primaryDark = '#5a7c5b';

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>Doações</h1>
        <p className="text-gray-600 max-w-2xl">
          Gerencie todas as doações realizadas na plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-t-4" style={{ borderTopColor: primaryColor }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{totalDonations}</div>
            <p className="text-xs text-muted-foreground">Desde o início</p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4" style={{ borderTopColor: primaryColor }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doações (último mês)</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{lastMonthDonations}</div>
            <p className="text-xs text-muted-foreground">+10% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4" style={{ borderTopColor: primaryColor }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Arrecadado</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>
              {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastMonthAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} no último mês
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4" style={{ borderTopColor: primaryColor }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>
              {completedDonations} concluídas
            </div>
            <p className="text-xs text-muted-foreground">{pendingDonations} pendentes</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: primaryLight }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border",
                    !dateRange && "text-muted-foreground"
                  )}
                  style={{ borderColor: primaryColor }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" style={{ color: primaryColor }} />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd MMM yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd MMM yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd MMM yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border" style={{ borderColor: primaryColor }}>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger 
                className="w-full border" 
                style={{ borderColor: primaryColor }}
              >
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent className="border" style={{ borderColor: primaryColor }}>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={DonationStatus.PENDING}>Pendente</SelectItem>
                <SelectItem value={DonationStatus.COMPLETED}>Concluída</SelectItem>
                <SelectItem value={DonationStatus.CANCELLED}>Cancelada</SelectItem>
                <SelectItem value={DonationStatus.FAILED}>Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Buscar</label>
            <Input 
              placeholder="Doador, instituição ou projeto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border"
              style={{ borderColor: primaryColor }}
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              className="w-full"
              style={{ 
                backgroundColor: primaryColor,
                borderColor: primaryDark,
              }}
              onClick={() => {
                setDateRange(undefined);
                setStatusFilter('all');
                setSearchTerm('');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm" style={{ borderColor: primaryLight }}>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead style={{ color: primaryColor }}>ID</TableHead>
              <TableHead style={{ color: primaryColor }}>Doador</TableHead>
              <TableHead style={{ color: primaryColor }}>Destinatário</TableHead>
              <TableHead style={{ color: primaryColor }}>Valor</TableHead>
              <TableHead style={{ color: primaryColor }}>Data</TableHead>
              <TableHead style={{ color: primaryColor }}>Status</TableHead>
              <TableHead style={{ color: primaryColor }}>Transação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <TableRow 
                  key={donation.id}
                  className="hover:bg-gray-50"
                  style={{ '--tw-bg-opacity': 0.1, backgroundColor: `rgba(123, 157, 124, var(--tw-bg-opacity))` } as React.CSSProperties}
                >
                  <TableCell className="font-medium">{donation.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{donation.donor.account.name}</div>
                      <div className="text-sm text-gray-500">{donation.donor.account.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {donation.project ? (
                      <div>
                        <div className="font-medium">{donation.project.name}</div>
                        <div className="text-sm text-gray-500">
                          {donation.project.institution.account.name}
                        </div>
                      </div>
                    ) : donation.institution ? (
                      <div className="font-medium">{donation.institution.account.name}</div>
                    ) : (
                      'Não especificado'
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {donation.amount.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(donation.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      donation.status === DonationStatus.COMPLETED 
                        ? 'bg-green-100 text-green-800' 
                        : donation.status === DonationStatus.PENDING 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : donation.status === DonationStatus.CANCELLED 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {donation.status === DonationStatus.COMPLETED ? 'Concluída' :
                       donation.status === DonationStatus.PENDING ? 'Pendente' :
                       donation.status === DonationStatus.CANCELLED ? 'Cancelada' : 'Falha'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {donation.paymentTransactionId}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhuma doação encontrada com os filtros selecionados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div 
        className="mt-6 bg-white rounded-lg p-4 shadow-sm border" 
        style={{ borderColor: primaryLight }}
      >
        <h3 className="font-medium mb-3" style={{ color: primaryColor }}>
          Resumo das Doações Filtradas
        </h3>
        <div className="flex justify-between">
          <div>
            <span className="text-gray-600">Total de doações: </span>
            <span className="font-medium" style={{ color: primaryColor }}>
              {filteredDonations.length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Valor total: </span>
            <span className="font-medium" style={{ color: primaryColor }}>
              {filteredDonations
                .reduce((sum, d) => sum + d.amount, 0)
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}