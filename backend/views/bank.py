from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import BankAccount, BankTransaction, Posting, db
from schemas import BankAccountSchema, BankTransactionSchema, PostingSchema
from utils import role_required
from datetime import datetime

bank_account_schema = BankAccountSchema()
bank_transaction_schema = BankTransactionSchema()
posting_schema = PostingSchema()

class BankAccountAPI(MethodView):
    decorators = [role_required({
        'admin': ['GET'],
        'bank': ['POST']
    }), jwt_required()]

    def get(self, account_id=None):
        def calculate_balance(account):
            balance = account.balance
            for transaction in account.transactions:
                if transaction.transaction_type == 'deposit':
                    balance += transaction.amount
                elif transaction.transaction_type == 'withdrawal':
                    balance -= transaction.amount
                elif transaction.transaction_type == 'transfer':
                    balance -= transaction.amount  
            return balance

        if account_id:
            account = BankAccount.query.get_or_404(account_id)
            current_balance = calculate_balance(account)
            account_data = bank_account_schema.dump(account)
            account_data['current_balance'] = current_balance
            return account_data
        accounts = BankAccount.query.all()
        result = []
        for account in accounts:
            account_data = bank_account_schema.dump(account)
            account_data['current_balance'] = calculate_balance(account)
            result.append(account_data)
        return jsonify(result)

    def post(self):
        data = request.json
        errors = bank_account_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        account = BankAccount(**data)
        db.session.add(account)
        db.session.commit()
        return bank_account_schema.dump(account), 201

    def put(self, account_id):
        account = BankAccount.query.get_or_404(account_id)
        data = request.json
        errors = bank_account_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        account.account_name = data['account_name']
        account.account_number = data['account_number']
        account.bank_name = data['bank_name']
        db.session.commit()
        return bank_account_schema.dump(account)

    def delete(self, account_id):
        account = BankAccount.query.get_or_404(account_id)
        db.session.delete(account)
        db.session.commit()
        return '', 204

class BankTransactionAPI(MethodView):
    decorators = [role_required({
        'admin': ['GET'],
        'bank': ['POST']
    }), jwt_required()]

    def get(self, transaction_id=None):
        if transaction_id:
            transaction = BankTransaction.query.get_or_404(transaction_id)
            return bank_transaction_schema.dump(transaction)
        transactions = BankTransaction.query.all()
        return bank_transaction_schema.dump(transactions, many=True)

    def post(self):
        data = request.json
        errors = bank_transaction_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        transaction = BankTransaction(
            bank_account_id=data['bank_account_id'],
            amount=data['amount'],
            transaction_type=data['transaction_type'],
            date=datetime.utcnow(),
            description=data.get('description', '')
        )
        db.session.add(transaction)
        db.session.commit()
        return bank_transaction_schema.dump(transaction), 201

class PostingAPI(MethodView):
    decorators = [role_required({
        'admin': ['GET'],
        'bank': ['POST']
    }), jwt_required()]

    def get(self, posting_id=None):
        if posting_id:
            posting = Posting.query.get_or_404(posting_id)
            return posting_schema.dump(posting)
        postings = Posting.query.all()
        return posting_schema.dump(postings, many=True)

    def post(self):
        data = request.json
        errors = posting_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        posting = Posting(
            posting_type=data['posting_type'],
            amount=data['amount'],
            date=datetime.utcnow(),
            description=data.get('description', ''),
            related_id=data.get('related_id')
        )
        db.session.add(posting)
        db.session.commit()
        return posting_schema.dump(posting), 201