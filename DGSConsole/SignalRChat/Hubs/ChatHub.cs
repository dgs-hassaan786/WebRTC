using System;
using System.Web;
using Microsoft.AspNet.SignalR;
using DGSConsole.Agent.ViewModels;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;

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

        public void Hello(string msg)
        {
        }


        public void Message(string o)
        {
            //switching type of the user message 
            var offer = JsonConvert.DeserializeObject<Offers>(o);

            switch (offer.Type)
            {
                //when a user tries to login 

                case "login":
                    {

                        //if anyone is logged in with this username then refuse 
                        var obj = UserOffers.Offers.FirstOrDefault(x => x.Name.Equals(offer.Name));
                        if (obj != null)
                        {
                            Clients.Client(Context.ConnectionId).onmessage(new { Type = "login", Success = false });
                        }
                        else
                        {
                            //save user connection on the server 
                            UserOffers.Offers.Add(new Offers() { ConnectionId = Context.ConnectionId, Name = offer.Name });
                            Clients.Client(Context.ConnectionId).onmessage(new { Type = "login", Success = true });
                        }
                    }
                    break;
                case "offer":
                    {
                        //for ex. UserA wants to call UserB 
                        //console.log("Sending offer to: ", offer.name);

                        //if UserB exists then send him offer details 
                        var offerConn = UserOffers.Offers.FirstOrDefault(x => x.Name.Equals(offer.Name));

                        if (offerConn != null)
                        {
                            //setting that UserA connected with UserB 
                            //connection.otherName = offer.name;
                            Clients.Client(offerConn.ConnectionId).onmessage(new { Type = "offer", Offer = offer.Offer, Name = offer.Name });
                        }
                    }
                    break;

                case "answer":
                    {
                        //console.log("Sending answer to: ", offer.name);
                        //for ex. UserB answers UserA 
                        var ansConn = UserOffers.Offers.FirstOrDefault(x => x.Name.Equals(offer.Name));

                        if (ansConn != null)
                        {                            
                            Clients.Client(ansConn.ConnectionId).onmessage(new { Type = "answer", Answer = offer.Answer });
                        }
                    }
                    break;

                case "candidate":
                    {
                        //console.log("Sending candidate to:", offer.name);
                        var candidateConn = UserOffers.Offers.FirstOrDefault(x => x.Name.Equals(offer.Name));

                        if (candidateConn != null)
                        {                           
                            Clients.Client(candidateConn.ConnectionId).onmessage(new { Type = "candidate", Candidate = offer.Candidate });
                        }
                    }
                    break;

                case "leave":
                    {
                        //console.log("Disconnecting from", offer.name);
                        var conn = UserOffers.Offers.FirstOrDefault(x => x.Name.Equals(offer.Name));
                                                
                        //notify the other user so he can disconnect his peer connection 
                        if (conn != null)
                        {                        
                            Clients.All.onmessage(new { Type = "leave", LeaveUser = conn });
                        }

                        

                    }
                    break;

                default:                    

                    Clients.Client(Context.ConnectionId).onmessage(new { Type = "error", Message = "Command not found: " + offer.Type });
                    break;
            }
        }
     
        public override System.Threading.Tasks.Task OnConnected()
        {
            ConnectionManager.AddAgent(Context);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var candidateConn = UserOffers.Offers.FirstOrDefault(x => x.ConnectionId.Equals(Context.ConnectionId));
            if(candidateConn != null)
            {
                UserOffers.Offers.Remove(candidateConn);
            }

            return base.OnDisconnected(stopCalled);
        }
        public void OnDisconnected()
        {
            //ConnectionManager.RemoveAgent(Context);
         
        }
        public void newConnection(string emailID)
        {            
            var allUsers = AgentDataProvider.GetAllAgentsData();
            var currentStatus = AgentDataProvider.GetStatus(emailID)!=null? AgentDataProvider.GetStatus(emailID):null;
            foreach (var user in allUsers)
            {
                if (user.Email ==emailID && currentStatus!=null)
                {
                    user.Status = currentStatus;
                }
            }
            Clients.All.newConnection(allUsers); 
        }
    }
}