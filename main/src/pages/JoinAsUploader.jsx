// pages/JoinUploader.jsx
import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const submittingRef = useRef(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validation per step
  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        toast.error("Name and Email are required.");
        return false;
      }
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
        toast.error("Please enter a valid email.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.rollNo || !formData.phone) {
        toast.error("Roll No and Phone are required.");
        return false;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Phone must be 10 digits.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.college || !formData.course || !formData.semester) {
        toast.error("College, Course, and Semester are required.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => validateStep() && setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    if (!formData.message) {
      toast.error("Please write why you want to be an uploader.");
      submittingRef.current = false;
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
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
      toast.error("❌ Failed to send request. Try again.");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const steps = ["Personal Info", "Contact", "Education", "Message"];

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

        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {steps.map((label, i) => (
              <div key={i} className="flex flex-col items-center">
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
              </div>
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
          <AnimatePresence exitBeforeEnter>
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} tip="Enter your full legal name." />
                <FormField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} tip="We'll notify you when verified." />
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <FormField label="College Roll No" name="rollNo" value={formData.rollNo} onChange={handleChange} tip="Enter your official college roll number." />
                <FormField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} tip="Provide a valid 10-digit number." />
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <FormField label="College / University" name="college" value={formData.college} onChange={handleChange} tip="Name of your college or university." />
                <FormField label="Course" name="course" value={formData.course} onChange={handleChange} tip="Example: BCA, BBA, etc." />
                <FormField label="Semester" name="semester" value={formData.semester} onChange={handleChange} tip="Which semester are you currently in?" />
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Why do you want to be an uploader?
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Explain briefly why you want to contribute as an uploader.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
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
            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
            {step === 4 && (
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

// Reusable Form Field Component
function FormField({ label, type = "text", name, value, onChange, tip }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
      {tip && <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tip}</span>}
    </div>
  );
}
