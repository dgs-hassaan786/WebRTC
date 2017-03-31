function SignalRProvider(model) {
    if (model == null || typeof model == 'undefined')
        throw 'model not found';

    var self = this;
    var hubConnection = window.location.origin;
    self.Status = model.Status;

    function onConnected() {
        return Object.keys(model).map((i) => i + '=' + model[i]).join('&');
    }

    self.initiate = function() {
        debugger
        //self.connection = $.hubConnection(hubConnection + '/signalr', { useDefaultPath: false, jsonp: true, transport: 'webSockets' });

        window.chat = $.connection.chatHub;
        window.chat.connection.qs = onConnected();

        $.connection.hub.start().done(function () {
            console.log('hub connected')
        });      
    }; 

    return self;
}