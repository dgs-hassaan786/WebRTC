using System;
using System.Web;
using Microsoft.AspNet.SignalR;
using DGSConsole.Agent.ViewModels;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;
using DGSConsole.Agent.Models;

namespace DGSConsole.Agent
{

    public class Offers
    {
        public string Type { get; set; }
        public object Candidate { get; set; }
        public bool Success { get; set; }
        public object Offer { get; set; }
        public string Name { get; set; }
        public string ConnectionId { get; set; }
        public object Answer { get; set; }
    }

    public static class UserOffers
    {
        public static List<Offers> Offers = new List<Offers>();
    }

    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.addNewMessageToPage(name, message);
        }
        public void sendMessage(string senderName, string message, string connID, string recievername)
        {

            Clients.All.broadcastMessage(senderName, message, recievername);

            //var myCachedUsers = AgentDataProvider.GetCache();
            //var allUsers = AgentDataProvider.GetAllAgentsData();
            //if (myCachedUsers.ContainsKey(senderName) && myCachedUsers[senderName].ConnectionIds.Where(x => x.Equals(Context.ConnectionId)).Count() > 0)
            //{
            //    var friendConnID = myCachedUsers.ContainsKey(recievername) ? myCachedUsers[recievername].ConnectionIds.FirstOrDefault() : null;               
            //    if (friendConnID != null)
            //    {                   
            //        Clients.All.broadcastMessage(senderName, message, friendConnID);                  
            //    }
            //}
        }

        public void Hello(string msg)
        {
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            ConnectionManagerAgent.AddAgent(Context);
            return base.OnConnected();
        }

        //public override Task OnDisconnected(bool stopCalled)
        //{
        //    var candidateConn = AgentDataProvider.Cache.Values.FirstOrDefault(x => x.ConnectionIds.Contains(Context.ConnectionId));
        //    if (candidateConn != null)
        //    {
        //        if(candidateConn.ConnectionIds.Count > 1)
        //        {
        //            candidateConn.ConnectionIds.Remove(Context.ConnectionId);
        //        }
        //        else
        //        {                   
        //            AgentDataProvider.Cache.TryRemove(Context.QueryString["Email"],out candidateConn);
        //        }                
        //    }

        //    return base.OnDisconnected(stopCalled);
        //}

        public void OnDisconnected()
        {
            //ConnectionManager.RemoveAgent(Context);

        }
        public void newConnection()
        {
            var allUsers = AgentDataProvider.GetAllAgentsData();
            var myCachedUsers = AgentDataProvider.GetCache();
            foreach (var user in allUsers)
            {
                if (myCachedUsers.ContainsKey(user.Email))
                {
                    user.Status = myCachedUsers[user.Email].Status;                    
                }              
            }
            Clients.All.newConnection(allUsers);
        }
    }
}