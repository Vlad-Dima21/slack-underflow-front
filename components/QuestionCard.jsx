import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import Topic from './Topic';

export const QuestionCard = ({ question, href, className }) => {
    const router = useRouter();
  return (
    <div className={`prompt_card flex justify-between ${className}`}>
        <div className='flex flex-col'>
            <Link href={href} className='flex gap-1'>
                  <span className='text-gray-600 text-sm'>@{question.user.username}</span>
                  <span className='question-card-title'>{question.title}</span>
            </Link>
            <span className='text-xs font-thin'>
              Modified: {' '}
              <span className='text-xs font-medium'>{new Date(question.updateTimestamp).toUTCString()}</span>
            </span>
        </div>
        <div className='flex sm:gap-2 gap-1'>
          {question.topics.map(topic => (
            <Topic
              key={topic}
              enabled={false}
              topic={topic}
              selected={true}
            />
          ))}
        </div>
    </div>
  )
}
