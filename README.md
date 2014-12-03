relayerSMS
==========

A marionette web application used to manage the sending and receiving of text messages for an android(4.4.0) device capable of sending/receiving SMS/MMS.


12/3/2014

I worked on getting the front end stack prepared all day yesterday. We are of course
using marionette and bootstrap. Also, new to the project sphere is require text. I finally figured out how to get the require text plugin working. Six months ago, I gave up on it, but that was before I understood the nodejs callback pattern. 

Heading forward, I intend to get text messages to show up on the message board. This means that I will be creating only three views for now, MessageBoardCompositeView, RelayerLayoutView, and MessageItemView. The message board will eventually filter out models by a given author name, and then sort by time stamp.

Relayer layout view will need to handle the rendering of the children views, such as when the sync button is pressed, the messages are fetched and then given to the message board view.

I should be able to show messages in one or two days. 

-WSP