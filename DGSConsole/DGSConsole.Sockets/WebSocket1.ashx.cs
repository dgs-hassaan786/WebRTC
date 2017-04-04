using Microsoft.Web.WebSockets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DGSConsole.Sockets
{
    /// <summary>
    /// Summary description for WebSocket1
    /// </summary>
    public class WebSocket1 : WebSocketHandler
    {
        private static WebSocketCollection clients = new WebSocketCollection();
        private string name;


        public override void OnOpen()
        {
            base.OnOpen();
        }

        public override void OnMessage(string message)
        {
            base.OnMessage(message);
        }

        
        
        public override void OnError()
        {
            base.OnError();
        }

        public override void OnClose()
        {
            base.OnClose();
        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("Hello World");
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}