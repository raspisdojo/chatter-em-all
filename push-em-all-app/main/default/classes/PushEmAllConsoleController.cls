public with sharing class PushEmAllConsoleController {
    private static Flow.Interview.PushEmAllApp_Send_Custom_Notification notificationFlow;

    @AuraEnabled
    public static void sendPushNotification(PushEmAllNotification notificationInfo) {
        Map<String, Object> myMap = new Map<String, Object>();
        myMap.put('PushEmAllApp_RecipientIds', getRecipientIds(notificationInfo.recipientIds));
        myMap.put('PushEmAllApp_CustomNotification', getPushEmAllCustomNotification());
        myMap.put('PushEmAllApp_NotificationBody', notificationInfo.body);
        myMap.put('PushEmAllApp_NotificationTitle', notificationInfo.title);
        myMap.put('PushEmAllApp_TargetRecordId', createPushEmAllLogRecord(notificationInfo).Id);
        notificationFlow = new Flow.Interview.PushEmAllApp_Send_Custom_Notification(myMap);
        notificationFlow.start();
    }

    public class PushEmAllNotification {
        @AuraEnabled
        public String body { get; set; }

        @AuraEnabled
        public String title { get; set; }

        @AuraEnabled
        public List<Id> recipientIds { get; set; }
    }

    private static PushEmAll_Log__c createPushEmAllLogRecord(PushEmAllnotification notificationInfo) {
        PushEmAll_Log__c record = new PushEmAll_Log__c(
            Notification_Title__c = notificationInfo.title,
            Notification_Body__c = notificationInfo.body
        );
        insert record;
        return record;
    }

    private static List<Id> getRecipientIds(List<Id> recordIds) {
        List<Id> userIds = new List<Id>();
        for (Id i : recordIds) {
            String sObjectName = getSobjectNameViaRecordId(i);
            switch on sObjectName {
                when 'User' {
                    userIds.add(i);
                }
                when 'Group' {
                    userIds.addAll(getGroupMembers(i));
                }
                when else {
                    throw new AuraHandledException('Unexpected ID as recipient!');
                }
            }
        }
        return userIds;
    }

    private static List<Id> getGroupMembers(Id groupId) {
        List<Id> userIds = new List<Id>();
        for (GroupMember member : [SELECT UserOrGroupId FROM GroupMember WHERE GroupId = :groupId]) {
            if (getSobjectNameViaRecordId(member.UserOrGroupId) == 'User') {
                userIds.add(member.UserOrGroupId);
            }
        }
        return userIds;
    }

    private static Id getPushEmAllCustomNotification() {
        return [SELECT Id FROM CustomNotificationType WHERE DeveloperName = 'Pushem_all_App' LIMIT 1].Id;
    }

    private static String getSobjectNameViaRecordId(Id recordId) {
        String objectName;
        if (String.isNotBlank(recordId)) {
            objectName = recordId.getSobjectType().getDescribe().getName();
        }
        return objectName;
    }
}
