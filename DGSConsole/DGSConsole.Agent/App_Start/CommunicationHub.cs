using DGSConsole.Agent.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace DGSConsole.Agent.App_Start
{
    public class CommunicationHub : Hub
    {
        private static ConcurrentDictionary<string, AgentLeg> _Cache = new ConcurrentDictionary<string, AgentLeg>();

        public override Task OnConnected()
        {
            ConnectionManager.AddAgent(Context);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            ConnectionManager.RemoveAgent(Context);
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            //ConnectionManager.AddAgent(Context);
            return base.OnReconnected();
        }

        internal class ConnectionManager
        {
            internal static bool AddAgent(HubCallerContext context)
            {
                try
                {
                    AgentLeg agent = new AgentLeg();
                    agent.Email = context.QueryString["Email"];
                    agent.Name = context.QueryString["Name"];
                    agent.Status = context.QueryString["Status"];
                    var connId = context.ConnectionId;

                    if (!_Cache.ContainsKey(agent.Email))
                    {
                        agent.ConnectionIds.Add(connId);
                        _Cache.TryAdd(agent.Email, agent);
                    }
                    else
                    {
                        var connIdExist = _Cache[agent.Email].ConnectionIds.FirstOrDefault(x => x.Equals(connId));
                        if (connIdExist == null)
                        {
                            _Cache[agent.Email].ConnectionIds.Add(connId);
                            _Cache[agent.Email].Status = agent.Status;
                            _Cache[agent.Email].Name = agent.Name;
                        }
                    }

                    return true;

                }
                catch (Exception)
                {
                    return false;
                }
            }
            internal static void RemoveAgent(HubCallerContext context)
            {
                try
                {
                    AgentLeg agent = new AgentLeg();
                    agent.Email = context.QueryString["Email"];
                    agent.Name = context.QueryString["Name"];
                    agent.Status = context.QueryString["Status"];
                    var connId = context.ConnectionId;                    
                    if (_Cache.ContainsKey(agent.Email))
                    {
                        if (_Cache[agent.Email].ConnectionIds.Count == 1)
                        {
                            _Cache.TryRemove(agent.Email,out agent);
                        }
                        else
                        {
                            if (_Cache[agent.Email].ConnectionIds.FirstOrDefault(x => x.Equals(connId)) != null)
                            {
                                _Cache[agent.Email].ConnectionIds.Remove(connId);
                            }
                        }                       
                    }
                }
                catch (Exception)
                {

                }
            }
        }


    }



}