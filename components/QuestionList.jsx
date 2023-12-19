'use client';

import { useCurrentUser } from "@helpers/user-hook";
import fetchHelper from "@helpers/fetch";
import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "./QuestionCard";
import LoadingWrapper from "./LoadingWrapper";

export default function QuestionList({ baseUrl }) {
    const [currentUser] = useCurrentUser();
    const [questions, setQuestions] = useState(null);
    const questionsLoading = useMemo(() => questions == null, [currentUser, questions]);
    const containerClass = useMemo(() => {
        console.log(questions?.length % 3 ? (questions?.length % 2 ? 1 : 2) : 3);
        return `grid grid-cols-${questions?.length % 3 ? (questions?.length % 2 ? 1 : 2) : 3} sm:gap-5 gap-3`;
    },
        [questions]
    );

    useEffect(() => {
        const getQuestions = async () => {
            let data;
            try {
                const response = await fetchHelper({
                    url: `${baseUrl}/question/getAll`,
                    method: 'GET',
                    bearer: currentUser.userToken
                });
                if (response.ok) {
                    data = await response.json();
                    setQuestions(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                !data.length && setQuestions([]);
            }
        }
        if (currentUser) {
            getQuestions();
        }
    }, [currentUser]);

    return (
        <div className="flex flex-col gap-5">
            <LoadingWrapper
                loadingState={questionsLoading}>
                <h2 className="font-satoshi ps-2 font-semibold text-lg self-start">Recent questions</h2>
                <div className={containerClass}>
                    {questions?.map(q => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            href={`/question/${q.id}`}
                        />
                    ))}
                </div>
            </LoadingWrapper>
        </div>
    )
}