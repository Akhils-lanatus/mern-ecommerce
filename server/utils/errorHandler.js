export function errorHandler(err, res) {
  let statusCode;
  if (err.name === "MongoServerError" && err.code === 11000) {
    statusCode = 400;
    return res.status(statusCode).json({
      success: false,
      message: `Some another product has already used same title, LOL 🤣`,
    });
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    let ErrString = "";
    Object.keys(err.errors).forEach((key, i) => {
      ErrString += i + 1 + ". " + err.errors[key].message + " ";
    });
    let slicedErrorString = ErrString.slice(0, -1);

    return res.status(statusCode).json({
      success: false,
      message: slicedErrorString,
    });
  } else {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
