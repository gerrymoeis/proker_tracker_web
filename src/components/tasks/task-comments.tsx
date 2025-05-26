'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_image: string | null;
}

interface TaskCommentsProps {
  taskId: number;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/comments?taskId=${taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil komentar');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, content: newComment }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      const data = await response.json();
      setComments(prevComments => [data, ...prevComments]);
      setNewComment('');
    } catch (err: any) {
      console.error('Error posting comment:', err);
      setError(err.message || 'Terjadi kesalahan saat mengirim komentar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      setError(err.message || 'Terjadi kesalahan saat menghapus komentar');
    }
  };

  // Load comments on component mount
  useEffect(() => {
    fetchComments();
  }, [taskId]);

  return (
    <div className="space-y-6">
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            {user?.profile_image ? (
              <AvatarImage src={user.profile_image} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Tambahkan komentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              'Kirim Komentar'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}

      <Separator />

      {/* Comments list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada komentar untuk tugas ini
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      {comment.author_image ? (
                        <AvatarImage src={comment.author_image} alt={comment.author_name} />
                      ) : null}
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {getInitials(comment.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.author_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment actions (delete) */}
                  {user && (user.id === comment.user_id || user.role === 'admin') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Opsi</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
