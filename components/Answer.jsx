import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAward } from '@fortawesome/free-solid-svg-icons';
import { useCurrentUser } from '@helpers/user-hook';
import fetchHelper from '@helpers/fetch';
import React from 'react'
import DropdownList from './DropdownList';

const Answer = ({ baseRoute, answer, onDeleted, onChanged }) => {
    const [currentUser] = useCurrentUser();
    const isAuthor = currentUser?.userName == answer.user.username;
    const isAuthorOfQuestion = currentUser?.userName == answer.question.user.username;

    const deleteAnswer = async () => {
        if (!confirm(`Confirm answer deletion`)) {
            return;
        }
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/answer/delete/${answer.id}`,
                method: 'DELETE',
                bearer: currentUser.userToken
            });
            const message = await response.json();
            if (response.ok) {
                onDeleted(answer.id);
            }
            alert(message);
        } catch (error) {
            console.log(error);
        }
    }

    const setRank = async (rank) => {
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/answer/modify/rank/${answer.id}?rank=${rank}`,
                method: 'PATCH',
                bearer: currentUser.userToken
            });
            const data = await response.json();
            if (response.ok) {
                onChanged(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex justify-between align-middle'>
            <div className='flex flex-col gap-2'>
                <div className='flex gap-1'>
                    <span className='text-gray-600 text-sm'>@{answer.user.username}</span>
                    <span className='!whitespace-normal !max-w-[34rem] question-card-title'>{answer.body}</span>
                </div>
                <span className='text-xs font-medium'>{new Date(answer.createTimestamp).toUTCString()}</span>
            </div>
            <div className='flex align-middle gap-3'>
                {!isAuthor && isAuthorOfQuestion && <DropdownList
                    className='flex justify-center items-center'
                    parent={
                        <div
                            className={`m-2 text-sm ${answer.rank ? 'text-yellow-600' : 'text-gray-700'}`}
                        >
                            <FontAwesomeIcon icon={faAward} />
                            {answer.rank || ''}
                        </div>
                    }
                    children={
                        <>
                            {[1, 2, 3].map(rank =>
                                <div key={rank} className='font-semibold p-3'
                                    onClick={() => setRank(rank)}>{rank}</div>)}
                        </>
                    }
                />}
                {isAuthor && <button
                    className='text-sm text-red-500 self-center m-2'
                    onClick={deleteAnswer}
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </button>}
            </div>
        </div>
    )
}

export default Answer