import React, { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import CloseIcon from "@mui/icons-material/Close";
import toast from "@/app/components/toast";

const SurveyForm = ({
  currentOperation,
  nodeCommands,
  setAction,
  setTriggered,
  triggered,
  session,
  ...node
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // برای حالت step-by-step

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/questions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch survey questions");
        }

        const data = await response.json();
        setQuestions(data.result);
        setLoading(false);
      } catch (error) {
        toast.error("خطا در دریافت سوالات نظرسنجی");
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [session.token]);

  const handleAnswerChange = (questionId, answerOptionId) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answerOptionId,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  const validateCurrentQuestion = () => {
    const question = questions[currentStep];
    if (!responses[question.id]) {
      setFormErrors((prev) => ({ ...prev, [question.id]: true }));
      toast.error("لطفاً یک گزینه انتخاب کنید");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (command) => {
    // در حالت step-by-step، وقتی به آخرین سوال رسیدیم و next زدیم، submit میشه
    if (currentStep < questions.length - 1) {
      handleNext();
      return;
    }

    // اعتبارسنجی نهایی
    const errors = {};
    let isValid = true;
    questions.forEach((question) => {
      if (!responses[question.id]) {
        errors[question.id] = true;
        isValid = false;
      }
    });
    if (!isValid) {
      toast.error("لطفاً به تمام سوالات پاسخ دهید");
      return;
    }

    try {
      const formattedResponses = Object.keys(responses).map((questionId) => ({
        questionId: parseInt(questionId),
        answerOptionId: parseInt(responses[questionId]),
      }));

      const payload = {
        requestStateId: +currentOperation.id,
        requestId: +currentOperation.requestId,
        nodeId: +node.id,
        nodeCommandId: +command.id,
        isClientSideCartable: false,
        repsponses: formattedResponses,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/submitSurvey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let jsonRes = await response.json();
        let errorMessage = jsonRes.errors ? jsonRes.errors[0] : jsonRes.message;
        throw new Error(errorMessage);
      }

      setTriggered(!triggered);
      setIsSuccess(true);
    } catch (error) {
      toast.error(error.message || "خطا در ارسال نظرسنجی");
      console.error("Error:", error);
    }
  };

  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <CircularProgress size={40} thickness={4} color="primary" />
        <p className="text-gray-600">در حال بارگذاری سوالات...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 bg-gray-50 rounded-xl">
        <CheckCircleOutlineIcon className="text-6xl text-green-500 mb-4" />
        <SentimentVerySatisfiedIcon className="text-4xl text-green-400 mb-4" />
        <h2 className="text-xl font-bold text-green-700 mb-2">
          نظرسنجی با موفقیت ارسال شد!
        </h2>
        <p className="text-gray-600 mb-6 text-center">از نظر ارزشمند شما متشکریم 🙏</p>
        <button
          onClick={() => setAction((prev) => ({ ...prev, isOpen: false }))}
          className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
        >
          بستن
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* هدر با دکمه بستن */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">نظرسنجی رضایت</h1>
        <button
          onClick={() => setAction((prev) => ({ ...prev, isOpen: false }))}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <CloseIcon className="text-gray-600" />
        </button>
      </div>

      {/* نوار پیشرفت ثابت در بالا */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">
            سوال {currentStep + 1} از {questions.length}
          </span>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* سوال فعلی - فقط یکی نمایش داده میشه */}
      <div className="mb-6">
        {currentQuestion && (
          <FormControl component="fieldset" fullWidth error={formErrors[currentQuestion.id]}>
            <FormLabel
              component="legend"
              className="font-semibold text-gray-800 text-base mb-3"
            >
              {currentStep + 1}. {currentQuestion.title}
            </FormLabel>

            <RadioGroup
              name={`question-${currentQuestion.id}`}
              value={responses[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.answerOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.title}
                  className="my-1.5 py-1.5 px-3 rounded-lg hover:bg-blue-50 transition"
                />
              ))}
            </RadioGroup>

            {formErrors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-2">
                لطفاً یک گزینه انتخاب کنید
              </p>
            )}
          </FormControl>
        )}
      </div>

      {/* دکمه‌های ناوبری و ارسال */}
      <div className="flex justify-between items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`px-5 py-2.5 font-medium rounded-lg transition ${
            currentStep === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          قبلی
        </button>

        <div className="flex gap-3">
          {nodeCommands?.map((command) => (
            <button
              key={command.id}
              onClick={() => handleSubmit(command)}
              style={{
                backgroundColor: command.nodeCommandType.commandColor || "#1976d2",
              }}
              className="px-6 py-2.5 text-white font-medium rounded-lg hover:opacity-90 transition"
            >
              {currentStep === questions.length - 1 ? command.name : "بعدی"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;