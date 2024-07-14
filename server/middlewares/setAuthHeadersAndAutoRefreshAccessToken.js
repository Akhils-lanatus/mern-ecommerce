import { generateCookies } from "../utils/generateCookies.js";
import { isTokenExpired } from "../utils/isTokenExpired.js";
import { refreshAccessToken } from "../utils/refreshAccessToken.js";
/* 
*** => NOTE: AUTH WILL BE ALWAYS BASED ON ACCESS TOKEN AS IT IS SHORT LIVED SO BETTER FOR SECURITY ***
* 1) check cookie(access) is present or is valid
      a) if yes set to headers
* 2) check cookie(refresh) is present 
      a) if not give response and bolo ki login kare chicha 
* 3) if token(refresh) is present then simply generate new token and set in headers and cookies 
*/
export const setAuthHeadersAndAutoRefreshAccessToken = async (
  req,
  res,
  next
) => {
  try {
    const cookiesAccessToken = req.cookies.accessToken;
    if (cookiesAccessToken || !isTokenExpired(cookiesAccessToken)) {
      req.headers["authorization"] = `Bearer ${cookiesAccessToken}`;
    }

    if (!cookiesAccessToken || isTokenExpired(cookiesAccessToken)) {
      const refToken = req.cookies.refreshToken;
      if (!refToken) {
        req.cookies.is_auth && res.clearCookie("is_auth");
        return res.status(400).json({
          success: false,
          message: "Unauthorized Request - Please Login",
          token: false,
        });
      }
      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
        await refreshAccessToken(req);

      generateCookies(
        res,
        accessToken,
        refreshToken,
        accessTokenExp,
        refreshTokenExp
      );

      req.headers["authorization"] = `Bearer ${accessToken}`;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Access token is missing or is invalid",
    });
  }
};
