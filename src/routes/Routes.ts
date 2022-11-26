import express from "express";
import UserValidation from "../middleware/validation/UserValidation";
import DokterController from "../controllers/DokterController";
import Authorization from "../middleware/Authorization";
import JadwalDokterController from "../controllers/JadwalDokterController";
import JadwalDokterValidation from "../middleware/validation/JadwalDokterValidation";

const router = express.Router();

router.post("/signup", UserValidation.RegisterValidation, DokterController.Register);
router.post("/login", UserValidation.LoginValidation, DokterController.UserLogin);
router.get("/refresh_token", DokterController.RefreshToken);
router.get("/profile", Authorization.Authenticated, DokterController.Profile);
router.get("/logout", Authorization.Authenticated, DokterController.UserLogout);
router.post("/verify_otp", UserValidation.VerifyOTPValidation, DokterController.VerifyOTP);
router.put("/profile/edit", [Authorization.Authenticated, UserValidation.EditProfileValidation], DokterController.EditProfile);
router.put("/profile/change_pass", [Authorization.Authenticated, UserValidation.ChangePasswordValidation], DokterController.ChangePassword);

router.post("/jadwal", [Authorization.Authenticated, JadwalDokterValidation.InputValidation], JadwalDokterController.AddJadwal);
router.get("/jadwal", JadwalDokterController.GetJadwal);
router.delete("/jadwal/:id", Authorization.Authenticated, JadwalDokterController.DeleteJadwal);
router.get("/jadwal/:id", Authorization.Authenticated, JadwalDokterController.GetJadwalDetail);
router.get("/dokter/jadwal", Authorization.Authenticated, JadwalDokterController.GetJadwalDokter);

router.get("/dokter", DokterController.GetAllDokter);
router.get("/dokter/:id", DokterController.DokterDetail);

export default router;