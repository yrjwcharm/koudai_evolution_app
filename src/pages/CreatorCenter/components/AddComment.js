/*
 * @Date: 2022-10-13 15:06:42
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-13 15:07:02
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/components/AddComment.js
 * @Description:
 */
export default function (props) {
    return (
        <PageModal ref={inputModal} title="写评论" style={{height: px(360)}} backButtonClose={true}>
            <TextInput
                ref={inputRef}
                value={content}
                multiline={true}
                style={styles.input}
                onChangeText={(value) => {
                    setContent(value);
                }}
                maxLength={500}
                textAlignVertical="top"
                placeholder="我来聊两句..."
            />
            <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                <View style={Style.flexRow}>
                    <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                        {content.length}/{500}
                    </Text>
                    <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={publish} />
                </View>
            </View>
        </PageModal>
    );
}
