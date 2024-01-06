import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCurrentUser } from '@helpers/user-hook';
import fetchHelper from '@helpers/fetch';
import React from 'react'

const Answer = ({ baseRoute, answer, onDeleted }) => {
    const [currentUser] = useCurrentUser();
    const isAuthor = currentUser?.userName == answer.user.username;

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

    return (
        <div className='flex justify-between align-middle'>
            <div className='flex flex-col gap-2'>
                <div className='flex gap-1'>
                    <span className='text-gray-600 text-sm'>@{answer.user.username}</span>
                    <span className='question-card-title'>{answer.body}</span>
                </div>
                <span className='text-xs font-medium'>{new Date(answer.createTimestamp).toUTCString()}</span>
            </div>
            {isAuthor && <button
                className='text-sm text-red-500 self-center m-2'
                onClick={deleteAnswer}
            >
                <FontAwesomeIcon icon={faTrash}/>
            </button>}
        </div>
    )
}

export default Answer