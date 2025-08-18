import {
  activeActions,
  pendingActions,
  suspendedActions,
} from '@/components/institutions/action-columns';
import { columns } from '@/components/institutions/columns';
import { InstitutionsTable } from '@/components/institutions/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetInstitutionsAccounts } from '@/service/account/requests';
import { useAuthStore } from '@/store/auth.store';
import { Account, AccountStatus, AccountType } from '@/types/account';
import { createFileRoute } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { FaUniversity, FaRegClock, FaRegPauseCircle } from 'react-icons/fa';

export const Route = createFileRoute('/_auth/institutions')({
  component: RouteComponent,
});

type InstitutionsTableProps = {
  token: string | null;
};

const mockInstitutions: Record<AccountStatus, Account[]> = {
  [AccountStatus.ACTIVE]: [
    {
      id: 1,
      name: 'Instituto Educacional Primavera',
      email: 'contato@primavera.edu.br',
      note: 'Instituição focada em educação infantil',
      createdAt: '2023-05-15',
      updatedAt: '2024-02-20',
      avatarId: null,
      accountType: AccountType.INSTITUTION,
      followingCount: 45,
      followersCount: 120,
      status: AccountStatus.ACTIVE,
      institution: {
        id: 101,
        cnpj: '12.345.678/0001-90',
        phone: '(11) 98765-4321',
        accountId: 1,
        categoryId: 1,
        category: {
          id: 1,
          name: 'Educação'
        }
      },
      donor: null,
      media: null,
    },
    {
      id: 2,
      name: 'Fundação Cultural Arte Viva',
      email: 'arte@fundacaoviva.org',
      note: 'Promovendo a cultura local',
      createdAt: '2023-02-28',
      updatedAt: '2024-01-15',
      avatarId: 'avatar-123',
      accountType: AccountType.INSTITUTION,
      followingCount: 32,
      followersCount: 85,
      status: AccountStatus.ACTIVE,
      institution: {
        id: 102,
        cnpj: '98.765.432/0001-21',
        phone: '(21) 99876-5432',
        accountId: 2,
        categoryId: 2,
        category: {
          id: 2,
          name: 'Cultura'
        }
      },
      donor: null,
      media: null,
    },
  ],
  [AccountStatus.PENDING]: [
    {
      id: 3,
      name: 'ONG Criança Feliz',
      email: 'contato@criancafeliz.org',
      note: 'Apoio a crianças carentes',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
      avatarId: null,
      accountType: AccountType.INSTITUTION,
      followingCount: 0,
      followersCount: 0,
      status: AccountStatus.PENDING,
      institution: {
        id: 103,
        cnpj: '55.444.333/0001-22',
        phone: '(31) 98765-1234',
        accountId: 3,
        categoryId: 3,
        category: {
          id: 3,
          name: 'Assistência Social'
        }
      },
      donor: null,
      media: null,
    },
  ],
  [AccountStatus.SUSPENDED]: [
    {
      id: 4,
      name: 'Associação Esportiva Juventude',
      email: 'esporte@juventude.org',
      note: 'Promoção de atividades esportivas',
      createdAt: '2022-11-15',
      updatedAt: '2023-10-01',
      avatarId: 'avatar-456',
      accountType: AccountType.INSTITUTION,
      followingCount: 18,
      followersCount: 67,
      status: AccountStatus.SUSPENDED,
      institution: {
        id: 104,
        cnpj: '77.888.999/0001-33',
        phone: '(41) 98765-9876',
        accountId: 4,
        categoryId: 4,
        category: {
          id: 4,
          name: 'Esportes'
        }
      },
      donor: null,
      media: null,
    },
  ],
  [AccountStatus.BANNED]: [],
  [AccountStatus.INACTIVE]: [],
};

function TableSkeleton() {
  return (
    <div className="w-full rounded-lg border p-4">
      <div className="space-y-4">
        <div className="flex justify-between">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-between pt-4">
            {[...Array(6)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-10 w-full mx-2" />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Loader className="animate-spin" size={24} style={{ color: '#7B9D7C' }} />
      </div>
    </div>
  );
}

function RegisteredInstitutionsTable({ token }: InstitutionsTableProps) {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  let institutions: Account[] = [];
  let isLoading = false;

  if (useMock) {
    institutions = mockInstitutions[AccountStatus.ACTIVE];
  } else {
    const { data, isLoading: loading } = useGetInstitutionsAccounts({
      token,
      status: AccountStatus.ACTIVE,
    });
    institutions = data || [];
    isLoading = loading;
  }

  return (
    <TabsContent value="registered">
      {isLoading && !useMock ? (
        <TableSkeleton />
      ) : (
        <InstitutionsTable
          columns={[...columns, ...activeActions]}
          data={institutions}
        />
      )}
    </TabsContent>
  );
}

function PendingInstitutionsTable({ token }: InstitutionsTableProps) {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  let institutions: Account[] = [];
  let isLoading = false;

  if (useMock) {
    institutions = mockInstitutions[AccountStatus.PENDING];
  } else {
    const { data, isLoading: loading } = useGetInstitutionsAccounts({
      token,
      status: AccountStatus.PENDING,
    });
    institutions = data || [];
    isLoading = loading;
  }

  return (
    <TabsContent value="pending">
      {isLoading && !useMock ? (
        <TableSkeleton />
      ) : (
        <InstitutionsTable
          columns={[...columns, ...pendingActions]}
          data={institutions}
        />
      )}
    </TabsContent>
  );
}

function SuspendedInstitutionsTable({ token }: InstitutionsTableProps) {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  let institutions: Account[] = [];
  let isLoading = false;

  if (useMock) {
    institutions = mockInstitutions[AccountStatus.SUSPENDED];
  } else {
    const { data, isLoading: loading } = useGetInstitutionsAccounts({
      token,
      status: AccountStatus.SUSPENDED,
    });
    institutions = data || [];
    isLoading = loading;
  }

  return (
    <TabsContent value="suspended">
      {isLoading && !useMock ? (
        <TableSkeleton />
      ) : (
        <InstitutionsTable
          columns={[...columns, ...suspendedActions]}
          data={institutions}
        />
      )}
    </TabsContent>
  );
}

function RouteComponent() {
  const { token } = useAuthStore();
  const primaryColor = '#7B9D7C';
  const primaryLight = 'rgba(123, 157, 124, 0.1)';

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <FaUniversity className="text-3xl" style={{ color: primaryColor }} />
          <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>Instituições</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Gerencie todas as instituições cadastradas no sistema. Visualize, edite ou altere o status
          das organizações conforme necessário.
        </p>
      </div>
      
      <Tabs defaultValue="registered">
        <TabsList 
          className="grid grid-cols-3 gap-2 w-full max-w-xl mb-8 p-2 rounded-xl"
          style={{ backgroundColor: primaryLight }}
        >
          <TabsTrigger 
            value="registered" 
            className="py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            style={{ 
              color: primaryColor,
              border: `1px solid ${primaryColor}`
            }}
          >
            <div className="flex items-center gap-2">
              <FaUniversity style={{ color: primaryColor }} />
              <span>Cadastradas</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            style={{ 
              color: primaryColor,
              border: `1px solid ${primaryColor}`
            }}
          >
            <div className="flex items-center gap-2">
              <FaRegClock style={{ color: primaryColor }} />
              <span>Pendentes</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="suspended" 
            className="py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            style={{ 
              color: primaryColor,
              border: `1px solid ${primaryColor}`
            }}
          >
            <div className="flex items-center gap-2">
              <FaRegPauseCircle style={{ color: primaryColor }} />
              <span>Suspensas</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <div 
          className="bg-white rounded-xl border shadow-sm p-2"
          style={{ borderColor: primaryLight }}
        >
          <RegisteredInstitutionsTable token={token} />
          <PendingInstitutionsTable token={token} />
          <SuspendedInstitutionsTable token={token} />
        </div>
      </Tabs>
    </div>
  );
}



