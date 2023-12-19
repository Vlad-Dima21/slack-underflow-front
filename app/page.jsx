import QuestionList from "@components/QuestionList";

export default function Home() {
  return (
    <>
      <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
              Share and Solve
              <br className="max-md:hidden" />
              <span className="orange_gradient text-center">Technical Questions</span>
          </h1>
        <p className="desc text-center">Empower your coding journey with SlackUnderflow – where questions find answers and developers connect to build together.</p>
      </section>
      <section className="flex-1 w-full mt-16">
          <QuestionList baseUrl={process.env.BACKEND_URL}/>
      </section>
    </>
  )
}
