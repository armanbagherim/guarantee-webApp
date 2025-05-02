import React, { useState, useEffect } from "react";
import {
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    CircularProgress,
    Card,
    CardContent,
    TextField
} from "@mui/material";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)'
    }
}));

const SurveyForm = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/questions`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${session.token}`
                    }
                });

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
        setResponses(prev => ({
            ...prev,
            [questionId]: answerOptionId
        }));
        setFormErrors(prev => ({
            ...prev,
            [questionId]: false
        }));
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        questions.forEach(question => {
            if (!responses[question.id]) {
                errors[question.id] = true;
                isValid = false;
            }
        });

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (command) => {
        if (!validateForm()) {
            toast.error("لطفاً به تمام سوالات پاسخ دهید");
            return;
        }

        try {
            const formattedResponses = Object.keys(responses).map(questionId => ({
                questionId: parseInt(questionId),
                answerOptionId: parseInt(responses[questionId])
            }));

            const payload = {
                requestStateId: +currentOperation.id,
                requestId: +currentOperation.requestId,
                nodeId: +node.id,
                nodeCommandId: +command.id,
                isClientSideCartable: false,
                repsponses: formattedResponses
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/submitSurvey`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${session.token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let jsonRes = await response.json()
                let errorMessage = jsonRes.errors ? jsonRes.errors[0] : jsonRes.message;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setTriggered(!triggered);
            setAction(prev => ({ ...prev, isOpen: false }));
            toast.success(result.result?.message || "نظرسنجی با موفقیت ثبت شد");
        } catch (error) {
            toast.error(error.message || "خطا در ارسال نظرسنجی");
            console.error("Error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress color="primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 p-2">
            <div className="space-y-4">
                {questions.map((question, index) => (
                    <StyledCard key={question.id}>
                        <CardContent>
                            <FormControl
                                component="fieldset"
                                className="w-full"
                                error={formErrors[question.id]}
                            >
                                <FormLabel
                                    component="legend"
                                    className="font-bold text-gray-700 mb-3"
                                    sx={{ fontSize: '1.1rem', color: '#333' }}
                                >
                                    {index + 1}. {question.title}
                                </FormLabel>
                                <RadioGroup
                                    aria-label={question.title}
                                    name={`question-${question.id}`}
                                    value={responses[question.id] || ""}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    className="space-y-2"
                                >
                                    {question.answerOptions.map(option => (
                                        <FormControlLabel
                                            key={option.id}
                                            value={option.id}
                                            control={<Radio color="primary" />}
                                            label={
                                                <span className="text-gray-600">
                                                    {option.title}
                                                </span>
                                            }
                                            className="hover:bg-gray-50 rounded-lg px-2 py-1"
                                        />
                                    ))}
                                </RadioGroup>
                                {formErrors[question.id] && (
                                    <span className="text-red-500 text-sm mt-1 block">
                                        لطفاً یک گزینه انتخاب کنید
                                    </span>
                                )}
                            </FormControl>
                        </CardContent>
                    </StyledCard>
                ))}


            </div>

            <div className="flex justify-end space-x-3 mt-6">
                {nodeCommands?.map((command) => (
                    <Button
                        key={command.id}
                        variant="contained"
                        size="large"
                        style={{
                            backgroundColor: command.nodeCommandType.commandColor,
                            borderRadius: '10px',
                            padding: '10px 24px',
                            fontWeight: '600',
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                        onClick={() => handleSubmit(command)}
                    >
                        {command.name}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default SurveyForm;