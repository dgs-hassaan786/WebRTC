using System;
using System.Web;
using Microsoft.AspNet.SignalR;
using DGSConsole.Agent.ViewModels;

namespace DGSConsole.Agent
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.addNewMessageToPage(name, message);
        }

        public void Hello(string msg)
        {
        }


        public override System.Threading.Tasks.Task OnConnected()
        {
            ConnectionManager.AddAgent(Context);
            return base.OnConnected();
        }
    }
}