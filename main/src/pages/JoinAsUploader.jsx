// pages/JoinUploader.jsx
import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ✅ Helper: validation logic
const validators = {
  name: (val) => /^[A-Za-z\s]+$/.test(val.trim()),
  email: (val) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val.trim()),
  rollNo: (val) => val.trim().length > 0,
  phone: (val) => /^\d{10}$/.test(val.trim()),
  college: (val) => val.trim().length > 2,
  course: (val) => val.trim().length > 1,
  semester: (val) => /^\d+$/.test(val.trim()) && Number(val) > 0 && Number(val) <= 12,
  message: (val) => val.trim().length >= 20,
};

export default function JoinAsUploader() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    phone: "",
    college: "",
    course: "",
    semester: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [reviewMode, setReviewMode] = useState(false);
  const submittingRef = useRef(false);
  const navigate = useNavigate();

  const steps = ["Personal Info", "Contact", "Education", "Message", "Review"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error
  };

  // ✅ Auto-focus next step
  useEffect(() => {
    const firstInput = document.querySelector("form input, form textarea");
    if (firstInput) firstInput.focus();
  }, [step]);

  // ✅ Step validation
  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!validators.name(formData.name)) newErrors.name = "Enter a valid name.";
      if (!validators.email(formData.email)) newErrors.email = "Enter a valid email.";
    }
    if (step === 2) {
      if (!validators.rollNo(formData.rollNo)) newErrors.rollNo = "Roll No is required.";
      if (!validators.phone(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone.";
    }
    if (step === 3) {
      if (!validators.college(formData.college)) newErrors.college = "College is required.";
      if (!validators.course(formData.course)) newErrors.course = "Course is required.";
      if (!validators.semester(formData.semester)) newErrors.semester = "Semester must be 1–12.";
    }
    if (step === 4) {
      if (!validators.message(formData.message))
        newErrors.message = "Message must be at least 20 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 4) setReviewMode(true);
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  // ✅ Secure sanitize function
  const sanitizeInput = (str) =>
    str.replace(/[<>$]/g, "").trim(); // simple sanitization

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    if (!validateStep()) {
      submittingRef.current = false;
      return;
    }

    setLoading(true);
    const sanitizedData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, sanitizeInput(v)])
    );

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        sanitizedData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("✅ Request sent successfully!");
      setFormData({
        name: "",
        email: "",
        rollNo: "",
        phone: "",
        college: "",
        course: "",
        semester: "",
        message: "",
      });
      navigate("/join-as-uploader/success", { state: { fromForm: true } });
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed: ${err.text || "Please try again later."}`);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen mt-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Join as Uploader
        </h1>

        {/* Step Progress Bar (Accessible) */}
        <div className="mb-6" aria-label="Progress bar" role="progressbar" aria-valuemin="1" aria-valuemax={steps.length} aria-valuenow={step}>
          <div className="flex justify-between mb-2">
            {steps.map((label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i + 1)}
                disabled={i + 1 > step}
                className="flex flex-col items-center focus:outline-none"
                aria-label={`Go to step ${i + 1}: ${label}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    step === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{label}</span>
              </button>
            ))}
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-1 bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!reviewMode && (
              <>
                {/* Step 1 */}
                {step === 1 && (
                  <StepWrapper key="step1">
                    <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                    <FormField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                  </StepWrapper>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <StepWrapper key="step2">
                    <FormField label="College Roll No" name="rollNo" value={formData.rollNo} onChange={handleChange} error={errors.rollNo} required />
                    <FormField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required />
                  </StepWrapper>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <StepWrapper key="step3">
                    <FormField label="College / University" name="college" value={formData.college} onChange={handleChange} error={errors.college} required />
                    <FormField label="Course" name="course" value={formData.course} onChange={handleChange} error={errors.course} required />
                    <FormField label="Semester" name="semester" value={formData.semester} onChange={handleChange} error={errors.semester} required />
                  </StepWrapper>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <StepWrapper key="step4">
                    <FormField
                      label="Why do you want to be an uploader?"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      textarea
                      required
                    />
                  </StepWrapper>
                )}
              </>
            )}

            {/* Review Step */}
            {reviewMode && step === 5 && (
              <StepWrapper key="review">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Review Your Info</h2>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {Object.entries(formData).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b pb-1">
                      <span className="font-medium capitalize">{k}:</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </StepWrapper>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Back
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
            {step === 5 && (
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ml-auto px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 transition"
              >
                {loading ? (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Submit"
                )}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ✅ Step Wrapper (motion)
function StepWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  );
}

// ✅ Accessible FormField
function FormField({ label, type = "text", name, value, onChange, error, textarea = false, required }) {
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;

  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          rows="4"
          className="mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          className="mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      )}
      {error && (
        <span id={errorId} className="text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
