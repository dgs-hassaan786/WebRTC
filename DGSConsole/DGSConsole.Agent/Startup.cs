using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DGSConsole.Agent.Startup))]
namespace DGSConsole.Agent
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
