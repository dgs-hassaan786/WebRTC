using DGSConsole.Agent.ViewModels;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace DGSConsole.Agent.App_Start
{
    public class CommunicationHub : Hub
    {       
        public override Task OnConnected()
        {
            ConnectionManager.AddAgent(Context);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            //ConnectionManager.RemoveAgent(Context);
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            //ConnectionManager.AddAgent(Context);
            return base.OnReconnected();
        }        
    }
}