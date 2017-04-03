using DGSConsole.Agent.Models;
using Microsoft.AspNet.SignalR.Hubs;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace DGSConsole.Agent.ViewModels
{
    internal static class AgentDataProvider
    {

        internal static ConcurrentDictionary<string, AgentLeg> Cache = new ConcurrentDictionary<string, AgentLeg>();

        internal static AgentLeg Get(string email, string password)
        {
            return GetAllAgentsData().FirstOrDefault(x => x.Email.Equals(email) && x.Password.Equals(password));
        }
        internal static string GetStatus(string email)
        {
            if (Cache != null && Cache.ContainsKey(email))
                return Cache[email].Status;
            else
                return null;
        }
        internal static void AddUser(AgentLeg agent)
        {
            if (!Cache.ContainsKey(agent.Email))
            {
                Cache.TryAdd(agent.Email, agent);
            }
            else
            {
                Cache[agent.Email].Status = agent.Status;
                Cache[agent.Email].Name = agent.Name;
                Cache[agent.Email].Role = agent.Role;
                Cache[agent.Email].Password = agent.Password;                
            }
        }


        public static List<AgentLeg> GetAllAgentsData()
        {
            List<AgentLeg> lst = new List<AgentLeg>();
            using (StreamReader r = new StreamReader(System.Web.Hosting.HostingEnvironment.MapPath("~/ViewModels/agents.json")))
            {
                string json = r.ReadToEnd();
                lst = JsonConvert.DeserializeObject<List<AgentLeg>>(json);
            }
            return lst;
        }
       
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

                if (!AgentDataProvider.Cache.ContainsKey(agent.Email))
                {
                    agent.ConnectionIds.Add(connId);
                    AgentDataProvider.Cache.TryAdd(agent.Email, agent);
                }
                else
                {
                    var connIdExist = AgentDataProvider.Cache[agent.Email].ConnectionIds.FirstOrDefault(x => x.Equals(connId));
                    if (connIdExist == null)
                    {
                        AgentDataProvider.Cache[agent.Email].ConnectionIds.Add(connId);
                        AgentDataProvider.Cache[agent.Email].Status = agent.Status;
                        AgentDataProvider.Cache[agent.Email].Name = agent.Name;
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
                if (AgentDataProvider.Cache!=null && AgentDataProvider.Cache.ContainsKey(context.QueryString["Email"]) &&
                    AgentDataProvider.Cache[context.QueryString["Email"]].ConnectionIds.FirstOrDefault(x=>x.Equals(context.ConnectionId)).Count()>0)
                {
                    AgentDataProvider.Cache[context.QueryString["Email"]].Status = "Logged Off";
                }
            }
            catch(Exception ex)
            {

            }
        }
    }
}