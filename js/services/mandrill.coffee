window.app.service 'mandrill', ($http, $log, mandrillAPIKey) ->
  ROOT = 'https://mandrillapp.com/api/1.0/'

  @onerror = (err) ->
    throw {source: 'mandrill',  name: err.name, message: err.message, toString: -> "#{err.name}: #{err.message}"}

  call = (uri, params={}, onresult, onerror) ->
    params.key = mandrillAPIKey
    params = JSON.stringify(params)

    $log.info("Mandrill:", "Opening request to #{ROOT}#{uri}.json")

    config =
      headers:
        'Content-Type': 'application/json; charset=utf-8'

    $http.post("#{ROOT}#{uri}.json", params, config)
    .success (data, status, headers, config) ->
      if status != 200
        $log.error("Mandrill error sending:", data)
        if onerror then onerror(data) else @onerror(data)
      else
        if onresult then onresult(data)

    .error (data, status, headers, config) ->
      $log.error("Mandrill error sending:", data)
      if onerror then onerror(data) else @onerror(data)

  srv =
    ###
    Parse `strOfMails` assuming that addresses are
    separated by a new line or comma
    ###
    parseEmails: (strOfMails, type = 'to') ->
      return [] if !strOfMails

      list = strOfMails.split('\n')

      recipients = []

      # let's check if any line has mails delimited by comma
      for str, i in list
        do (i, str) ->
          arr = str.split(',')
          if arr.length > 1
            recipients = recipients.concat arr
          else
            recipients.push str
          return

      for mail, i in recipients
        recipients[i] =
          email: mail
          type : type

      return recipients

    ###
    Send a new transactional message through Mandrill
    @param {Object} params the hash of the parameters to pass to the request
    @option params {Struct} message the information on the message to send
         - html {String} the full HTML content to be sent
         - text {String} optional full text content to be sent
         - subject {String} the message subject
         - from_email {String} the sender email address.
         - from_name {String} optional from name to be used
         - to {Array} an array of recipient information.
             - to[] {Object} a single recipient's information.
                 - email {String} the email address of the recipient
                 - name {String} the optional display name to use for the recipient
                 - type {String} the header type to use for the recipient, defaults to "to" if not provided
         - headers {Object} optional extra headers to add to the message (most headers are allowed)
         - important {Boolean} whether or not this message is important, and should be delivered ahead of non-important messages
         - track_opens {Boolean} whether or not to turn on open tracking for the message
         - track_clicks {Boolean} whether or not to turn on click tracking for the message
         - auto_text {Boolean} whether or not to automatically generate a text part for messages that are not given text
         - auto_html {Boolean} whether or not to automatically generate an HTML part for messages that are not given HTML
         - inline_css {Boolean} whether or not to automatically inline all CSS styles provided in the message HTML - only for HTML documents less than 256KB in size
         - url_strip_qs {Boolean} whether or not to strip the query string from URLs when aggregating tracked URL data
         - preserve_recipients {Boolean} whether or not to expose all recipients in to "To" header for each email
         - view_content_link {Boolean} set to false to remove content logging for sensitive emails
         - bcc_address {String} an optional address to receive an exact copy of each recipient's email
         - tracking_domain {String} a custom domain to use for tracking opens and clicks instead of mandrillapp.com
         - signing_domain {String} a custom domain to use for SPF/DKIM signing instead of mandrill (for "via" or "on behalf of" in email clients)
         - return_path_domain {String} a custom domain to use for the messages's return-path
         - merge {Boolean} whether to evaluate merge tags in the message. Will automatically be set to true if either merge_vars or global_merge_vars are provided.
         - merge_language {String} the merge tag language to use when evaluating merge tags, either mailchimp or handlebars
         - global_merge_vars {Array} global merge variables to use for all recipients. You can override these per recipient.
             - global_merge_vars[] {Object} a single global merge variable
                 - name {String} the global merge variable's name. Merge variable names are case-insensitive and may not start with _
                 - content {Mixed} the global merge variable's content
         - merge_vars {Array} per-recipient merge variables, which override global merge variables with the same name.
             - merge_vars[] {Object} per-recipient merge variables
                 - rcpt {String} the email address of the recipient that the merge variables should apply to
                 - vars {Array} the recipient's merge variables
                     - vars[] {Object} a single merge variable
                         - name {String} the merge variable's name. Merge variable names are case-insensitive and may not start with _
                         - content {Mixed} the merge variable's content
         - tags {Array} an array of string to tag the message with.  Stats are accumulated using tags, though we only store the first 100 we see, so this should not be unique or change frequently.  Tags should be 50 characters or less.  Any tags starting with an underscore are reserved for internal use and will cause errors.
             - tags[] {String} a single tag - must not start with an underscore
         - subaccount {String} the unique id of a subaccount for this message - must already exist or will fail with an error
         - google_analytics_domains {Array} an array of strings indicating for which any matching URLs will automatically have Google Analytics parameters appended to their query string automatically.
         - google_analytics_campaign {Array|string} optional string indicating the value to set for the utm_campaign tracking parameter. If this isn't provided the email's from address will be used instead.
         - metadata {Array} metadata an associative array of user metadata. Mandrill will store this metadata and make it available for retrieval. In addition, you can select up to 10 metadata fields to index and make searchable using the Mandrill search api.
         - recipient_metadata {Array} Per-recipient metadata that will override the global values specified in the metadata parameter.
             - recipient_metadata[] {Object} metadata for a single recipient
                 - rcpt {String} the email address of the recipient that the metadata is associated with
                 - values {Array} an associated array containing the recipient's unique metadata. If a key exists in both the per-recipient metadata and the global metadata, the per-recipient metadata will be used.
         - attachments {Array} an array of supported attachments to add to the message
             - attachments[] {Object} a single supported attachment
                 - type {String} the MIME type of the attachment
                 - name {String} the file name of the attachment
                 - content {String} the content of the attachment as a base64-encoded string
         - images {Array} an array of embedded images to add to the message
             - images[] {Object} a single embedded image
                 - type {String} the MIME type of the image - must start with "image/"
                 - name {String} the Content ID of the image - use <img src="cid:THIS_VALUE"> to reference the image in your HTML content
                 - content {String} the content of the image as a base64-encoded string
    @option params {Boolean} async enable a background sending mode that is optimized for bulk sending. In async mode, messages/send will immediately return a status of "queued" for every recipient. To handle rejections when sending in async mode, set up a webhook for the 'reject' event. Defaults to false for messages with no more than 10 recipients; messages with more than 10 recipients are always sent asynchronously, regardless of the value of async.
    @option params {String} ip_pool the name of the dedicated ip pool that should be used to send the message. If you do not have any dedicated IPs, this parameter has no effect. If you specify a pool that does not exist, your default pool will be used instead.
    @option params {String} send_at when this message should be sent as a UTC timestamp in YYYY-MM-DD HH:MM:SS format. If you specify a time in the past, the message will be sent immediately. An additional fee applies for scheduled email, and this feature is only available to accounts with a positive balance.
    @param {Function} onsuccess an optional callback to execute when the API call is successfully made
    @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    ###
    send: (params = {}, onsuccess, onerror) ->
      if typeof params == 'function'
        onerror = onsuccess
        onsuccess = params
        params = {}

      params["async"] ?= false
      params["ip_pool"] ?= null
      params["send_at"] ?= null

      call('messages/send', params, onsuccess, onerror)

    ###
    Send a new transactional message through Mandrill using a template
    @param {Object} params the hash of the parameters to pass to the request
    @option params {String} template_name the immutable name or slug of a template that exists in the user's account. For backwards-compatibility, the template name may also be used but the immutable slug is preferred.
    @option params {Array} template_content an array of template content to send.  Each item in the array should be a struct with two keys - name: the name of the content block to set the content for, and content: the actual content to put into the block
         - template_content[] {Object} the injection of a single piece of content into a single editable region
             - name {String} the name of the mc:edit editable region to inject into
             - content {String} the content to inject
    @option params {Struct} message the other information on the message to send - same as /messages/send, but without the html content
         - html {String} optional full HTML content to be sent if not in template
         - text {String} optional full text content to be sent
         - subject {String} the message subject
         - from_email {String} the sender email address.
         - from_name {String} optional from name to be used
         - to {Array} an array of recipient information.
             - to[] {Object} a single recipient's information.
                 - email {String} the email address of the recipient
                 - name {String} the optional display name to use for the recipient
                 - type {String} the header type to use for the recipient, defaults to "to" if not provided
         - headers {Object} optional extra headers to add to the message (most headers are allowed)
         - important {Boolean} whether or not this message is important, and should be delivered ahead of non-important messages
         - track_opens {Boolean} whether or not to turn on open tracking for the message
         - track_clicks {Boolean} whether or not to turn on click tracking for the message
         - auto_text {Boolean} whether or not to automatically generate a text part for messages that are not given text
         - auto_html {Boolean} whether or not to automatically generate an HTML part for messages that are not given HTML
         - inline_css {Boolean} whether or not to automatically inline all CSS styles provided in the message HTML - only for HTML documents less than 256KB in size
         - url_strip_qs {Boolean} whether or not to strip the query string from URLs when aggregating tracked URL data
         - preserve_recipients {Boolean} whether or not to expose all recipients in to "To" header for each email
         - view_content_link {Boolean} set to false to remove content logging for sensitive emails
         - bcc_address {String} an optional address to receive an exact copy of each recipient's email
         - tracking_domain {String} a custom domain to use for tracking opens and clicks instead of mandrillapp.com
         - signing_domain {String} a custom domain to use for SPF/DKIM signing instead of mandrill (for "via" or "on behalf of" in email clients)
         - return_path_domain {String} a custom domain to use for the messages's return-path
         - merge {Boolean} whether to evaluate merge tags in the message. Will automatically be set to true if either merge_vars or global_merge_vars are provided.
         - merge_language {String} the merge tag language to use when evaluating merge tags, either mailchimp or handlebars
         - global_merge_vars {Array} global merge variables to use for all recipients. You can override these per recipient.
             - global_merge_vars[] {Object} a single global merge variable
                 - name {String} the global merge variable's name. Merge variable names are case-insensitive and may not start with _
                 - content {Mixed} the global merge variable's content
         - merge_vars {Array} per-recipient merge variables, which override global merge variables with the same name.
             - merge_vars[] {Object} per-recipient merge variables
                 - rcpt {String} the email address of the recipient that the merge variables should apply to
                 - vars {Array} the recipient's merge variables
                     - vars[] {Object} a single merge variable
                         - name {String} the merge variable's name. Merge variable names are case-insensitive and may not start with _
                         - content {Mixed} the merge variable's content
         - tags {Array} an array of string to tag the message with.  Stats are accumulated using tags, though we only store the first 100 we see, so this should not be unique or change frequently.  Tags should be 50 characters or less.  Any tags starting with an underscore are reserved for internal use and will cause errors.
             - tags[] {String} a single tag - must not start with an underscore
         - subaccount {String} the unique id of a subaccount for this message - must already exist or will fail with an error
         - google_analytics_domains {Array} an array of strings indicating for which any matching URLs will automatically have Google Analytics parameters appended to their query string automatically.
         - google_analytics_campaign {Array|string} optional string indicating the value to set for the utm_campaign tracking parameter. If this isn't provided the email's from address will be used instead.
         - metadata {Array} metadata an associative array of user metadata. Mandrill will store this metadata and make it available for retrieval. In addition, you can select up to 10 metadata fields to index and make searchable using the Mandrill search api.
         - recipient_metadata {Array} Per-recipient metadata that will override the global values specified in the metadata parameter.
             - recipient_metadata[] {Object} metadata for a single recipient
                 - rcpt {String} the email address of the recipient that the metadata is associated with
                 - values {Array} an associated array containing the recipient's unique metadata. If a key exists in both the per-recipient metadata and the global metadata, the per-recipient metadata will be used.
         - attachments {Array} an array of supported attachments to add to the message
             - attachments[] {Object} a single supported attachment
                 - type {String} the MIME type of the attachment
                 - name {String} the file name of the attachment
                 - content {String} the content of the attachment as a base64-encoded string
         - images {Array} an array of embedded images to add to the message
             - images[] {Object} a single embedded image
                 - type {String} the MIME type of the image - must start with "image/"
                 - name {String} the Content ID of the image - use <img src="cid:THIS_VALUE"> to reference the image in your HTML content
                 - content {String} the content of the image as a base64-encoded string
    @option params {Boolean} async enable a background sending mode that is optimized for bulk sending. In async mode, messages/send will immediately return a status of "queued" for every recipient. To handle rejections when sending in async mode, set up a webhook for the 'reject' event. Defaults to false for messages with no more than 10 recipients; messages with more than 10 recipients are always sent asynchronously, regardless of the value of async.
    @option params {String} ip_pool the name of the dedicated ip pool that should be used to send the message. If you do not have any dedicated IPs, this parameter has no effect. If you specify a pool that does not exist, your default pool will be used instead.
    @option params {String} send_at when this message should be sent as a UTC timestamp in YYYY-MM-DD HH:MM:SS format. If you specify a time in the past, the message will be sent immediately. An additional fee applies for scheduled email, and this feature is only available to accounts with a positive balance.
    @param {Function} onsuccess an optional callback to execute when the API call is successfully made
    @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    ###
    sendTemplate: (params = {}, onsuccess, onerror) ->
      if typeof params == 'function'
        onerror = onsuccess
        onsuccess = params
        params = {}

      params["async"] ?= false
      params["ip_pool"] ?= null
      params["send_at"] ?= null

      call('messages/send-template', params, onsuccess, onerror)
