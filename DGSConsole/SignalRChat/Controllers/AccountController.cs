using DGSConsole.Agent.Models;
using DGSConsole.Agent.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace DGSConsole.Agent.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true

            var result = ValidateUser(model.Email, model.Password);
            if (result != null)
            {
                List<Claim> claims = new List<Claim>();
                claims.Add(new Claim("Role", result.Role));
                claims.Add(new Claim("Name", result.Name));
                claims.Add(new Claim("Email", result.Email));
                var properties = new Microsoft.Owin.Security.AuthenticationProperties
                {
                    IsPersistent = false,
                    AllowRefresh = true,
                    ExpiresUtc = DateTimeOffset.Now.AddHours(8),
                    IssuedUtc = DateTimeOffset.Now
                };
                var id = new ClaimsIdentity(claims.AsEnumerable(), "DGSConsoleCookies", "email", result.Role);
                id.AddClaim(new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", "Admin"));
                id.AddClaim(new Claim("http:/esscontrolservice/2010/07/claims/identityprovider/schemas.microsoft.com/acc", "Admin"));
                Request.GetOwinContext().Authentication.SignIn(properties, id);
                result.Status = "Login";

                AgentDataProvider.AddUser(result);
                return RedirectToLocal(returnUrl);
            }
            else
            {
                ModelState.AddModelError("", "Invalid login attempt.");
                return View(model);
            }
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            Request.GetOwinContext().Authentication.SignOut("DGSConsoleCookies");
            ExpireCache(true);
            return RedirectToAction("Index", "Home");
        }

        private void ExpireCache(bool noStore = false)
        {
            try
            {
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
                Response.Cache.SetNoStore();

                if (noStore)
                {
                    Response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                    Response.AddHeader("Pragma", "no-cache");
                    Response.AddHeader("Expires", "0");
                }
            }
            catch (Exception ex)
            {

            }

        }

        private AgentLeg ValidateUser(string email, string password)
        {
            return AgentDataProvider.Get(email, password);
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

}