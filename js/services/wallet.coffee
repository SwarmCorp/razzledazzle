window.app.service 'Wallet', ($q, $http, $filter, Counterparty, RestChain, chainAPIKey, RestBlockscan)->
	bitcore = require 'bitcore'
	return {
		# Create a new wallet
		new: ->
			basePath = 'm/0\'/0/0'
			mnemonic = new Mnemonic 128
			words = mnemonic.toWords()
			seed = new Mnemonic(words).toHex()
			hierarchicalKey = bitcore.HDPrivateKey.fromSeed seed
			derivedKey = hierarchicalKey.derive basePath

			return {
				passphrase: words.join ' '
				public: derivedKey.publicKey.toAddress().toString()
				private: derivedKey.privateKey.toWIF()
			}

		# Create a wallet from passphrase
		fromPassphrase: (passphrase) ->
			words = passphrase.trim().toLowerCase().split(' ')
			if words.length == 12
				basePath = 'm/0\'/0/0'
				seed = new Mnemonic(words).toHex()
				hierarchicalKey = bitcore.HDPrivateKey.fromSeed(seed)
				derivedKey = hierarchicalKey.derive(basePath)

				return {
					passphrase: words.join ' '
					public: derivedKey.publicKey.toAddress().toString()
					private: derivedKey.privateKey.toWIF()
				}

		getAssets: (address) ->
			self = this
			defer = $q.defer()
			RestBlockscan
			.one('api2')
			.customGET('', {'module': 'address', 'action': 'balance', 'btc_address': address})
			.then (assetsData) ->
				assetsData = assetsData.data
				self.getBtcBalance(address)
				.then (btcData)->
					btcVal = btcData[0].total.balance
					assetsData.unshift
						asset: 'BTC'
						balance: $filter('satoshiToBTC')(btcVal, 3, false)
					defer.resolve assetsData
				.then null, ()->
					defer.resolve assetsData
			.then null, (reason) ->
				defer.reject reason
			return defer.promise

		getBtcBalance: (address)->
			defer = $q.defer()
			RestChain
			.one 'bitcoin/addresses'
			.customGET(address, {'api-key-id': chainAPIKey})
			.then (response)->
				defer.resolve response
			.then null, (reason)->
				defer.reject reason
			return defer.promise

		# Check if public key is valid
		check: (key) ->
			return bitcore.Address.isValid(key)

		# Generate paper wallet
		pdf: (wallet) ->

			# Generate wallet keys QR codes
			keyQr = (text, size) ->
				qr = new QRCode 5, 0, '8bit'
				qr.addData text
				qr.make()

				canvas = document.createElement 'canvas'
				canvas.width = canvas.height = size
				modules = qr.getModuleCount()
				tile = size / modules
				context = canvas.getContext '2d'

				row = 0
				while row < modules
					col = 0
					while col < modules
						w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile))
						h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile))
						context.fillStyle = (if qr.isDark(row, col) then '#000' else '#fff')
						context.fillRect Math.round(col * tile), Math.round(row * tile), w, h
						col++
					row++
				return canvas.toDataURL()

			# Generate PDF File
			publicKeyQR = keyQr wallet.public, 150
			privateKeyQR = keyQr wallet.private, 150
			doc = new jsPDF()
			doc.setFillColor 248, 248, 248
			doc.rect 0, 0, 220, 300, 'F'
			doc.setFillColor 255, 255, 255
			doc.rect 0, 0, 220, 30, 'F'

			# Header logo
			doc.setLineWidth 1
			doc.circle 25, 15, 5, 'D'
			# Header text
			doc.setFont 'helvetica', 'normal'
			doc.setFontSize 12
			doc.text 35, 17, 'Swarm.co'
			doc.setLineWidth .4
			doc.line 56, 13, 56, 18
			doc.text 59, 17, 'Revolutionizing Crowdfunding'
			# Header bottom line
			doc.setDrawColor 198, 198, 198
			doc.line 0, 30, 220, 30

			# Main page title
			doc.setFontSize(22)
			doc.text 80, 50, 'Paper Wallet'

			# Passphrase
			doc.setFillColor 255, 255, 255
			doc.rect 0, 62, 220, 17, 'F'
			doc.setFontSize 14
			doc.setFont 'helvetica', 'bold'
			doc.text 15, 70, 'Secret 12 word passphrase.'
			doc.setFontSize 9
			doc.setFont 'helvetica', 'normal'
			doc.text 15, 75, wallet.passphrase

			# Private key
			doc.setFontSize(14)
			doc.setFont 'helvetica', 'bold'
			doc.text 28, 92, 'PUBLIC key'
			doc.setFontSize 9
			doc.setFont 'helvetica', 'normal'
			doc.text 30, 96, '(Load & Verify)'
			doc.addImage publicKeyQR, 'JPEG', 15, 100, 50, 50
			doc.text 68, 120, wallet.public

			# Private key
			doc.setFontSize(14)
			doc.setFont 'helvetica', 'bold'
			doc.text 157, 92, 'PRIVATE key'
			doc.setFontSize 9
			doc.setFont 'helvetica', 'normal'
			doc.text 165, 96, '(Redeem)'
			doc.setFontSize 6
			doc.addImage privateKeyQR, 'JPEG', 145, 100, 50, 50
			doc.text 68, 125, wallet.private

			doc.setDrawColor 198, 198, 198
			doc.line 0, 160, 220, 160
			doc.setFillColor 248, 248, 248
			doc.rect 0, 160, 220, 180, 'F'
			doc.setFontSize 10
			doc.setFont 'helvetica', 'bold'
			doc.text 15, 170, 'In order to access or exchange the assets contained in this address,'
			doc.text 15, 175, 'you should go to https://counterwallet.io/ and enter your 12 word passphrase.'

			doc.save 'PaperWallet.pdf'
	}