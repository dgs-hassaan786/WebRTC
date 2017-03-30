using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;

[assembly: OwinStartupAttribute(typeof(DGSConsole.Agent.Startup))]
namespace DGSConsole.Agent
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
            ConfigureAuthorizationServer(app);            
        }

        private static void ConfigureAuthorizationServer(IAppBuilder app)
        {

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = "BACCookies",
                CookieName = "BACCookies",
                LoginPath = new PathString("/Account/login")
            });
        }
    }
}
