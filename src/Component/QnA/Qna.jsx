import { useState } from "react";
import EditorInput from "./EditorInput";
import Header from "../Header";
import PrevQnaLog from "./PrevQnaLog";
import SampleQuestions from "./SampleQuestions";

import "./Qna.css";
import SideNav from "../SideNav";
import useLocalStorage from "../useLocalStorage";

function Qna() {
  const [code, setCode] = useState("# Enter code here...\n");
  const [question, setQuestion] = useState("");
  const [qnaList, setQnaList] = useLocalStorage("history", []);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useLocalStorage("language", "python");

  const data = {
    prompt: code + "\n" + question,
    temperature: 0,
    max_tokens: 64,
  };

  const getAnswer = async () => {
    setLoading(true);
    const answer = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-001/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
        },
        body: JSON.stringify(data),
      }
    );
    const body = await answer.json();
    let time = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });

    setLoading(false);
    const copy = qnaList.map((x) => x);
    let searchHistoryObject = {
      code,
      question,
      answer: body.choices[0].text,
      time,
      language,
    };
    copy.push(searchHistoryObject);
    setQnaList(copy);

    setQuestion("");
  };

  return (
    <div>
      <Header />
      <div className="flexContainer">
        <SideNav />
        <div className="flexDiv1">
          <textarea
            className="textArea"
            rows="5"
            cols="20"
            placeholder="Enter question here..."
            value={question}
            onChange={(v) => setQuestion(v.target.value)}
          />
          <SampleQuestions setQuestion={setQuestion} />
          <button className="submitButton" type="submit" onClick={getAnswer}>
            Submit
          </button>
          <PrevQnaLog qnaList={qnaList} loading={loading} />
        </div>
        <div className="flexDiv2">
          <EditorInput
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
      </div>
    </div>
  );
}

export default Qna;
