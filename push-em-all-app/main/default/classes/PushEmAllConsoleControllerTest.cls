@isTest
private class PushEmAllConsoleControllerTest {
    private final static String NOTIFICATION_TITLE = 'Sample title';
    private final static String NOTIFICATION_BODY = 'Sample body';
    private final static String TEST_GROUP_NAME = 'PushEmAllTestGroup';

    @TestSetup
    private static void makeData() {
        Group testGroup = new Group(Name = TEST_GROUP_NAME, DeveloperName = TEST_GROUP_NAME, Type = 'Regular');
        insert testGroup;

        GroupMember testGroupMember = new GroupMember(GroupId = testGroup.Id, UserOrGroupId = UserInfo.getUserId());
        insert testGroupMember;
    }

    @isTest
    private static void testNotificationToUser() {
        Test.startTest();
        PushEmAllConsoleController.sendPushNotification(getTestNotification(UserInfo.getUserId()));
        Test.stopTest();

        PushEmAll_Log__c logRecord = [
            SELECT Id, Notification_Title__c, Notification_Body__c
            FROM PushEmAll_Log__c
            LIMIT 1
        ];

        System.assertEquals(false, logRecord == null, 'A record was expected');
        System.assertEquals(NOTIFICATION_TITLE, logRecord.Notification_Title__c, 'Title has to match');
    }

    @isTest
    private static void testNotificationToGroup() {
        Test.startTest();
        PushEmAllConsoleController.sendPushNotification(getTestNotification(getTestGroupId()));
        Test.stopTest();

        PushEmAll_Log__c logRecord = [
            SELECT Id, Notification_Title__c, Notification_Body__c
            FROM PushEmAll_Log__c
            LIMIT 1
        ];

        System.assertEquals(false, logRecord == null, 'A record was expected');
        System.assertEquals(NOTIFICATION_TITLE, logRecord.Notification_Title__c, 'Title has to match');
    }

    private static PushEmAllConsoleController.PushEmAllNotification getTestNotification(Id userOrGroupId) {
        PushEmAllConsoleController.PushEmAllNotification testNotification = new PushEmAllConsoleController.PushEmAllNotification();
        testNotification.title = NOTIFICATION_TITLE;
        testNotification.body = NOTIFICATION_BODY;
        testNotification.recipientIds = new List<Id>{ userOrGroupId };
        return testNotification;
    }

    private static Id getTestGroupId() {
        return [SELECT Id FROM Group WHERE DeveloperName = :TEST_GROUP_NAME LIMIT 1].Id;
    }
}
