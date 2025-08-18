import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '@/store/auth.store';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

type Account = {
  id: number;
  name: string;
};

type MediaAttachment = {
  remoteUrl: string;
};

type Comment = {
  id: number;
  body: string;
  account: Account;
  createdAt: string;
};

type Institution = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  body: string;
  institution: Institution;
  createdAt: string;
  media: MediaAttachment | null;
  comments: Comment[];
};

const mockPosts: Post[] = [
  {
    id: 1,
    body: 'Estamos muito felizes em anunciar que arrecadamos mais de R$ 10.000 para a construção da nova biblioteca comunitária! Agradecemos a todos os doadores que tornaram isso possível.',
    institution: { id: 1, name: 'Instituto Educacional Primavera' },
    createdAt: '2024-05-20T14:30:00Z',
    media: { remoteUrl: 'https://www.mercadoeeventos.com.br/wp-content/uploads/2022/11/Centro-Histórico-..jpg' },
    comments: [
      {
        id: 101,
        body: 'Que notícia incrível! Parabéns a toda equipe pelo trabalho.',
        account: { id: 101, name: 'Carlos Silva' },
        createdAt: '2024-05-20T15:45:00Z'
      },
      {
        id: 102,
        body: 'Como posso contribuir para o próximo projeto?',
        account: { id: 102, name: 'Maria Oliveira' },
        createdAt: '2024-05-21T09:15:00Z'
      }
    ]
  },
  {
    id: 2,
    body: 'A campanha de inverno está começando! Precisamos de cobertores, agasalhos e alimentos não perecíveis. Venha fazer a diferença nesta temporada fria.',
    institution: { id: 2, name: 'ONG Solidariedade' },
    createdAt: '2024-05-18T10:00:00Z',
    media: { remoteUrl: 'https://www.mercadoeeventos.com.br/wp-content/uploads/2022/11/Centro-Histórico-..jpg' },
    comments: [
      {
        id: 103,
        body: 'Tenho várias roupas para doar, onde posso levar?',
        account: { id: 103, name: 'Ana Souza' },
        createdAt: '2024-05-18T11:30:00Z'
      }
    ]
  },
  {
    id: 3,
    body: 'Continuamos com nosso projeto de aulas gratuitas de música para crianças e adolescentes. Novas vagas abertas!',
    institution: { id: 3, name: 'Centro Cultural Harmonia' },
    createdAt: '2024-05-15T09:00:00Z',
    media: { remoteUrl: 'https://www.mercadoeeventos.com.br/wp-content/uploads/2022/11/Centro-Histórico-..jpg' },
    comments: [
      {
        id: 104,
        body: 'Minha filha adorou as aulas! Obrigada pela oportunidade.',
        account: { id: 104, name: 'Roberta Mendes' },
        createdAt: '2024-05-16T16:20:00Z'
      },
      {
        id: 105,
        body: 'Qual a faixa etária atendida?',
        account: { id: 105, name: 'Pedro Alves' },
        createdAt: '2024-05-17T08:45:00Z'
      },
      {
        id: 106,
        body: 'Para crianças de 6 a 16 anos, Pedro.',
        account: { id: 3, name: 'Centro Cultural Harmonia' },
        createdAt: '2024-05-17T10:30:00Z'
      }
    ]
  },
  {
    id: 4,
    body: 'Nossa horta comunitária já está produzindo! Venha colher alimentos frescos e saudáveis toda quarta-feira.',
    institution: { id: 4, name: 'Projeto Terra Viva' },
    createdAt: '2024-05-22T08:00:00Z',
    media: { remoteUrl: 'https://www.mercadoeeventos.com.br/wp-content/uploads/2022/11/Centro-Histórico-..jpg' },
    comments: []
  },
  {
    id: 5,
    body: 'Precisamos de voluntários para o evento de adoção de animais deste final de semana. Se você ama bichinhos, venha nos ajudar!',
    institution: { id: 5, name: 'Abrigo Animal' },
    createdAt: '2024-05-23T12:00:00Z',
    media: { remoteUrl: 'https://www.mercadoeeventos.com.br/wp-content/uploads/2022/11/Centro-Histórico-..jpg' },
    comments: [
      {
        id: 107,
        body: 'Posso ajudar no sábado à tarde!',
        account: { id: 106, name: 'Luísa Fernandes' },
        createdAt: '2024-05-23T14:20:00Z'
      }
    ]
  }
];

const mockInstitutions = Array.from(new Set(mockPosts.map(post => post.institution.name)));

function RouteComponent() {
  const { getUser } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [institutionFilter, setInstitutionFilter] = useState<string>('all');
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  
  const primaryColor = '#7B9D7C';
  const primaryLight = 'rgba(123, 157, 124, 0.1)';
  const primaryDark = '#5a7c5b';

  const filteredPosts = posts.filter(post => {
    if (dateRange?.from && dateRange?.to) {
      const postDate = new Date(post.createdAt);
      if (postDate < dateRange.from || postDate > dateRange.to) {
        return false;
      }
    }
    
    if (institutionFilter !== 'all' && post.institution.name !== institutionFilter) {
      return false;
    }
    
    return true;
  });

  const deletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const deleteComment = (postId: number, commentId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleCommentExpansion = (postId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const confirmDeletePost = () => {
    if (postToDelete !== null) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      setPostToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">

      <Dialog open={postToDelete !== null} onOpenChange={() => setPostToDelete(null)}>
        <DialogContent 
          className="sm:max-w-[425px]"
          style={{ borderColor: primaryColor }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: primaryColor }}>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPostToDelete(null)}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDeletePost}
              style={{ 
                backgroundColor: primaryColor,
                borderColor: primaryDark,
              }}
            >
              Excluir Publicação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Olá, {getUser()?.name}
        </h1>
        <p className="text-gray-600">
          Gerencie as publicações e comentários da plataforma
        </p>
      </div>

      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: primaryLight }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium mb-1">Instituição</label>
            <Select 
              value={institutionFilter} 
              onValueChange={setInstitutionFilter}
            >
              <SelectTrigger 
                className="w-full border" 
                style={{ borderColor: primaryColor }}
              >
                <SelectValue placeholder="Selecione uma instituição" />
              </SelectTrigger>
              <SelectContent className="border" style={{ borderColor: primaryColor }}>
                <SelectItem value="all">Todas as instituições</SelectItem>
                {mockInstitutions.map(institution => (
                  <SelectItem key={institution} value={institution}>
                    {institution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                setInstitutionFilter('all');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl border p-5 shadow-sm relative"
              style={{ borderColor: primaryLight }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold" style={{ color: primaryColor }}>
                    {post.institution.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setPostToDelete(post.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </Button>
                
              </div>
              
              <div className="mb-4">
                <p className="whitespace-pre-line">{post.body}</p>
              </div>
              
              {post.media && (
                <div className="mb-4">
                  <img 
                    src={post.media.remoteUrl} 
                    alt="Mídia da publicação" 
                    className="rounded-lg object-cover w-full"
                  />
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2"
                    style={{ color: primaryColor }}
                  >
                    <MessageSquare size={16} />
                    <span>{post.comments.length} comentários</span>
                  </Button>
                  
                  {post.comments.length > 2 && (
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => toggleCommentExpansion(post.id)}
                      style={{ color: primaryColor }}
                    >
                      {expandedComments[post.id] ? 'Ver menos' : 'Ver todos'}
                    </Button>
                  )}
                </div>
                
                {showComments[post.id] && (
                  <div 
                    className="border-t pt-3 mt-3"
                    style={{ borderColor: primaryLight }}
                  >
                    <div className="space-y-4">
                      {(expandedComments[post.id] 
                        ? post.comments 
                        : post.comments.slice(0, 2)
                      ).map(comment => (
                        <div key={comment.id} className="relative group">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <strong>{comment.account.name}</strong>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(comment.createdAt), 'dd/MM/yy HH:mm', { locale: ptBR })}
                                </span>
                              </div>
                              <p>{comment.body}</p>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteComment(post.id, comment.id)}
                            className="absolute top-0 right-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: primaryLight }}>
            <p className="text-gray-500">
              Nenhuma publicação encontrada com os filtros selecionados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}