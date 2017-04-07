using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace RTCApp
{
    [HubName("appHub")]
    public class AppHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }
        public void Send(string message)
        {
            // Clients.Others.receive(context);
            Clients.Others.newMessage(message);
        }
    }
}