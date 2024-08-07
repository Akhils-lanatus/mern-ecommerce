import React, { useState } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/showToast";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CustomDialog from "../../../utils/customDialog";
import { createNewBrandAsync } from "../../product-list/ProductSlice";
const AddNewBrand = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const handleAddNewBrand = async () => {
    try {
      const res = await dispatch(createNewBrandAsync(formValues));
      if (res?.error) {
        let errors = JSON.parse(res.error.message);
        showToast("ERROR", errors.message);
      }
      if (res?.payload) {
        showToast("SUCCESS", res.payload?.message);
        navigate("/admin/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add New Brand
        </h2>
        <Formik
          initialValues={{
            value: "",
            label: "",
          }}
          validationSchema={Yup.object({
            label: Yup.string()
              .required("Label Is Required")
              .min(4, "Field should have atleast 4 characters"),
            value: Yup.string()
              .required("Value Is Required")
              .min(4, "Field should have atleast 4 characters"),
          })}
          onSubmit={async (values, actions) => {
            setFormValues(values);
            setOpen(true);
            // actions.resetForm();
          }}
        >
          <Form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label
                  htmlFor="label"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Brand Label
                </label>
                <Field
                  type="text"
                  name="label"
                  id="label"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Brand Label"
                  required=""
                />
                <p className="text-sm text-red-600 mt-2">
                  <ErrorMessage name="label" />
                </p>
              </div>
              <div>
                <label
                  htmlFor="value"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Brand Value
                </label>
                <Field
                  type="text"
                  name="value"
                  id="value"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Brand Value"
                  required=""
                />
                <p className="text-sm text-red-600 mt-2">
                  <ErrorMessage name="value" />
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Add Brand
            </button>
          </Form>
        </Formik>
      </div>
      {open && (
        <CustomDialog
          open={open}
          setOpen={setOpen}
          Icon={PlusCircleIcon}
          buttonColor="green"
          buttonText="Add"
          dialogContent="Confirm want to add new brand?"
          dialogTitle="Add New Brand"
          onConfirm={handleAddNewBrand}
        />
      )}
    </section>
  );
};

export default AddNewBrand;
