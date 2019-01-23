from socketIO_client import SocketIO, BaseNamespace

class ChatNamespace(BaseNamespace):

    def on_connect(self):
        print('connect')

    def on_disconnect(self):
        print('disconnect')

    def on_reconnect(self):
        print('reconnect')

    def on_message(self,*args):
        print('on_message', args)

socketIO = SocketIO('localhost', 5000)
chat = socketIO.define(ChatNamespace, '/client')
print 'send'
chat.emit('message','dd')
socketIO.wait()