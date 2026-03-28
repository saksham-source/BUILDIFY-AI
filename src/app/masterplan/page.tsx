'use client';

import { motion } from 'framer-motion';
import {
  ChevronLeft, Copy, Download, RefreshCw, FileText,
  Sparkles, CheckCircle2, Rocket, Users, Database,
  Shield, TrendingUp, Lightbulb, Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MasterplanPage() {
  const router = useRouter();
  const [masterplan, setMasterplan] = useState<string>('');
  const [startupName, setStartupName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedMasterplan = sessionStorage.getItem('masterplan');
    const inputData = sessionStorage.getItem('startupInput');

    if (!savedMasterplan) {
      router.push('/cto-chat');
      return;
    }

    setMasterplan(savedMasterplan);
    if (inputData) {
      const { name } = JSON.parse(inputData);
      setStartupName(name);
    }
  }, [router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(masterplan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([masterplan], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${startupName || 'startup'}-masterplan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    sessionStorage.clear();
    router.push('/');
  };

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="bg-white/60 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm text-primary-400">{codeContent}</code>
            </pre>
          );
          codeContent = '';
          codeLanguage = '';
        } else {
          codeLanguage = line.slice(3).trim();
        }
        inCodeBlock = !inCodeBlock;
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold gradient-text mt-8 mb-4 flex items-center gap-3"
          >
            <FileText className="w-8 h-8" />
            {line.slice(2)}
          </motion.h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <motion.h2
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="text-2xl font-semibold text-gray-900 mt-6 mb-3 flex items-center gap-2"
          >
            <span className="w-1 h-6 bg-primary-500 rounded-full" />
            {line.slice(3)}
          </motion.h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <motion.h3
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-medium text-primary-400 mt-4 mb-2"
          >
            {line.slice(4)}
          </motion.h3>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.01 }}
            className="flex items-start gap-3 my-2 text-gray-700"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>{line.slice(2)}</span>
          </motion.div>
        );
      } else if (line.match(/^\d+\.\s/)) {
        elements.push(
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 my-2 text-gray-700 ml-4"
          >
            <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
              {line.match(/^\d+/)?.[0]}
            </span>
            <span>{line.replace(/^\d+\.\s/, '')}</span>
          </motion.div>
        );
      } else if (line.trim()) {
        elements.push(
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 my-2 leading-relaxed"
          >
            {line}
          </motion.p>
        );
      }
    });

    return elements;
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/cto-chat')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Chat
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-white/80 border border-gray-200 
                         hover:border-white/20 transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-white/80 border border-gray-200 
                         hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartOver}
              className="px-4 py-2 rounded-lg bg-white/80 border border-gray-200 
                         hover:border-white/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Idea
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Masterplan Generated
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">{startupName || 'Your Startup'}</span>
          </h1>
          <p className="text-xl text-gray-600">Complete Product Blueprint</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="prose prose-invert max-w-none">
            {renderMarkdownContent(masterplan)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { icon: Target, label: 'Concept Defined', color: 'text-red-400' },
            { icon: Database, label: 'Tech Stack Ready', color: 'text-blue-400' },
            { icon: Rocket, label: 'MVP Planned', color: 'text-green-400' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
              <p className="font-medium">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Generated by Buildify AI with CTO Advisor</p>
          <p className="mt-1">Powered by MiniMax API</p>
        </motion.footer>
      </div>
    </main>
  );
}
