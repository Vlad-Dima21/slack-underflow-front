import Question from '@components/Question';
import QuestionState from 'enums/QuestionState';
import React from 'react';

const ViewQuestion = ({params: {id}}) => {
  return (
    <Question
        questionId={id}
        state={QuestionState.Added}
        baseRoute={process.env.BACKEND_URL}
    />
  )
}

export default ViewQuestion;