using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;
using DGSConsole.Agent.ViewModels;

namespace DGSConsole.Agent.App_Start
{
    [HubName("consoleHub")]
    public class ConsoleHub : Hub
    {

        public void Hello(string msg)
        {
        }

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