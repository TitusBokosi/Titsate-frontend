import { BookOpen, FileText, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

import { useSubmission, useSubmitProject } from '../hooks/useSubmissions';

interface LessonContentProps {
  lesson: any;
}

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative group my-6">
      <div className="absolute right-3 top-3 z-20">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Copy className="size-4 text-zinc-400" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
        customStyle={{
          margin: 0,
          borderRadius: '1rem',
          padding: '1.5rem',
          fontSize: '0.9rem',
          background: '#1e1e1e', 
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export function LessonContent({ lesson }: LessonContentProps) {
  if (!lesson) return null;

  const { data: submissionRes } = useSubmission(lesson.id);
  const submitProjectMutation = useSubmitProject();
  const [projectUrl, setProjectUrl] = useState('');

  const submission = submissionRes?.data;

  const handleSubmit = async () => {
    if (!projectUrl.trim()) return;
    await submitProjectMutation.mutateAsync({
      lessonId: lesson.id,
      projectUrl,
    });
    setProjectUrl('');
  };

  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-3xl md:text-5xl font-black mb-5 leading-tight">
        {lesson.lessonName}
      </h2>

      <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 mb-10 leading-relaxed relative overflow-hidden">
        <div className="relative z-10">
          {lesson.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <FileText className="size-16 mb-4" />
              <p>No content available for this unit yet.</p>
            </div>
          )}
        </div>
      </div>

      {lesson.lessonType === 'MINI_PROJECT' && (
        <div className="bg-primary border border-primary/20 text-white rounded-md p-8 md:p-10 mb-10 shadow-2xl shadow-primary/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                 Project Submission
              </h3>
              <p className="text-white/80 max-w-xl">
                Ready to show what you've learned? Submit your project URL  below.
              </p>
            </div>
            {submission && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0 py-2 px-4 text-sm font-bold">
                Status: {submission.status}
              </Badge>
            )}
          </div>

          {!submission ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                placeholder="https://github.com/your-username/project"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-md px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button
                onClick={handleSubmit}
                disabled={!projectUrl || submitProjectMutation.isPending}
                className="bg-white text-primary font-black px-10 py-4 rounded-md hover:bg-zinc-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitProjectMutation.isPending ? 'Submitting...' : 'Submit Project'}
              </button>
            </div>
          ) : (
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <p className="text-sm text-white/60 mb-2 font-bold uppercase tracking-wider">Your Submission</p>
              <a 
                href={submission.projectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-medium hover:underline break-all block"
              >
                {submission.projectUrl}
              </a>
              {submission.feedback && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60 mb-1 font-bold">Feedback:</p>
                  <p className="text-white/90">{submission.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
