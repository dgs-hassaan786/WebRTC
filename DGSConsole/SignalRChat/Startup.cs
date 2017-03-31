using Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Cors;

[assembly: OwinStartup(typeof(DGSConsole.Agent.Startup))]
namespace DGSConsole.Agent
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
            ConfigureAuthorizationServer(app);
            app.UseCors(CorsOptions.AllowAll);
        }

        private static void ConfigureAuthorizationServer(IAppBuilder app)
        {

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = "DGSConsoleCookies",
                CookieName = "DGSConsoleCookies",
                LoginPath = new PathString("/Account/login")
            });
        }
    }
}